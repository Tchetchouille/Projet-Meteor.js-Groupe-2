import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';
import { loadavg } from 'os';

import './body.html';
import './templates/formulaire_profil.html';
import './templates/logIn.html';
import './templates/barre_navigation.html';
import './templates/uploadForm';
import './templates/listeArticles';
import './templates/file';


Template.logIn.helpers({
    //signingIn permet d'afficher des choses différentes en fonction de si la personne remplit le formulaire d'inscription ou non.
    'signingIn' : function(){
        let signingIn = Session.get('signingIn');
        return signingIn;
    },
    'logingIn' : function(){
        let logingIn = Session.get('logingIn');
        return logingIn;
    } 
});

Template.logIn.events({
    //En cliquant ce bouton, on affiche le formulaire
    'click .signIn' : function(){
        Session.set('signingIn', true);
    },
    //La soumission du formulaire de création de compte
    'submit .formLogIn' : function(event){
        event.preventDefault();
        let emailVar = event.target.loginEmail.value;
        let passwordVar = event.target.loginPassword.value;
        //Permet de login l'utilisateur et de lui afficher l'erreur si il y en a une. A améliorer plus tard.
        Meteor.loginWithPassword(emailVar, passwordVar, function(error){
            alert(error.reason);
        });
        Session.set('signingIn', false);
    },
    //En cliquant ce bouton, le formulaire disparait.
    'click .retour' : function(){
        Session.set('signingIn', false);
    }
});

Template.barre_navigation.events({
    'click .logOut' : function(){
        Meteor.logout();
    }
});

Template.formulaire_inscription_profil.events({
    'submit .formulaire_inscription_profil' : function(event){
        //Pour ne pas recharger la page
        event.preventDefault();

        //Pour vérifier que le mdp est bien entré correctement
        let mdp = $('[id=password]').val();
        let mdpControle = $('[id=password_verification]').val();

        if(mdp==mdpControle){
            //Ici j'essaie de stocker toutes ces infos dans newUserData, de la même manière que "adress" et "verified" sont stockés dans "email"
            let newUserData = {
                nom: $('[id=name]').val(),
                prenom: $('[id=firstName]').val(),
                email:  $('[id=email_adress]').val(),
                mot_de_passe:  mdp,
                universite:  $('[id=university]').val(),
                domaine:  $('[id=branch]').val()
            };

            let user = {
                email: $('[id="email_adress"]').val(),
                password: $('[id="password"]').val()
            };
            //Modifié en se basant sur : https://themeteorchef.com/tutorials/sign-up-with-email-verification
            //Etrangement, ramène à la page d'acceuil en cas de problème avec le formulaire
            Accounts.createUser( user, ( error ) => {
                if ( error ) {
                  alert( error.reason, 'danger' );
                } 
                else {
                  Meteor.call( 'sendVerificationLink', ( error, response ) => {
                    if ( error ) {
                      alert(error.reason);
                    } 
                    else {
                      alert('Welcome!');
                    }
                  });
                }
              });
            
            //La méthode qui créera le profil lié à l'utilisateur
            Meteor.call('creerUtilisateur', newUserData);
            
            //L'utilisateur est automatiquement loged in quand il crée son compte.
            Meteor.loginWithPassword(newUserData.email, newUserData.mot_de_passe);
            Session.set('signingIn', false);
        }
        else{
            //Dans un second temps il faudra prendre en compte tous les champs et afficher les remarques directement sur les champs qui posent problèmes
            alert("Le mot de passe ne correspond pas à la vérification !")
        }
    }
});

let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
};

export const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false,
  debug: Meteor.isServer && process.env.NODE_ENV === 'development',
  onAfterUpload(image) {
    // Move file to GridFS
    Object.keys(image.versions).forEach(versionName => {
      const metadata = { versionName, imageId: image._id, storedAt: new Date() }; // Optional
      const writeStream = gfs.createWriteStream({ filename: image.name, metadata });

      fs.createReadStream(image.versions[versionName].path).pipe(writeStream);

      writeStream.on('close', Meteor.bindEnvironment(file => {
        const property = `versions.${versionName}.meta.gridFsFileId`;

        // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
        // LocalCollection.ObjectID, which GFS doesn't understand.
        this.collection.update(image._id, { $set: { [property]: file._id.toString() } });
        this.unlink(this.collection.findOne(image._id), versionName); // Unlink files from FS
      }));
    });
  },
  interceptDownload(http, image, versionName) {
    // Serve file from GridFS
    const _id = (image.versions[versionName].meta || {}).gridFsFileId;
    if (_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on('error', err => { throw err; });
      readStream.pipe(http.response);
    }
    return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
  },
  onAfterRemove(images) {
    // Remove corresponding file from GridFS
    images.forEach(image => {
      Object.keys(image.versions).forEach(versionName => {
        const _id = (image.versions[versionName].meta || {}).gridFsFileId;
        if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
      });
    });
  }

});


if(Meteor.isClient){
Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput'(e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      const upload = Images.insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
  }
});
};

if(Meteor.isClient){
Template.listeArticles.helpers({
  'article': function(){
    return Images.find();
  },
  'selectedClass': function(){
    var articleId= this._id;
    var selectedArticle= Session.get('selectedArticle');
    if (articleId == selectedArticle){
        return "selected";
    }
  },
  'selectedArticle': function(){
    var selectedArticle=Session.get('selectedArticle');
    return Images.findOne({_id: selectedArticle});
  }
});

Template.listeArticles.events({
  'click .article': function(){
    var articleId= this._id;
    Session.set('selectedArticle', articleId);
    var fsId= this.files_id;
    console.log(fsId);
  }
});

Template.file.helpers({
  'file': function() {
   var selectedArticle=Session.get('selectedArticle');
   return Images.findOne({_id: selectedArticle});
  }
})
}