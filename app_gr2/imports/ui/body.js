import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './body.html';
import './templates/formulaire_profil.html';
import './templates/logIn.html';
import './templates/barre_navigation.html';
import './zoesCode.js';


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