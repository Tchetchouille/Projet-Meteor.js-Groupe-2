import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './body.html';
import './templates/formulaire_profil.html';
import './templates/logIn.html';
import './templates/barre_navigation.html';


Template.logIn.helpers({
    //signingIn permet d'afficher des choses différentes en fonction de si la personne remplit le formulaire d'inscription ou non.
    'signingIn' : function(){
        let signingIn = Session.get('signingIn');
        return signingIn;
    },
    'logingIn' : function(){
        let logingIn = Session.get('logingIn');
        return logingIn;
    },
    'logedIn' : function(){
        let logedIn = Session.get('logedIn');
        return logedIn;
    }    
});

Template.logIn.events({
    //En cliquant ce bouton, on affiche le formulaire
    'click .signIn' : function(){
        Session.set('signingIn', true);
    },

    //WORK IN PROGRESS : Je dois me renseigner sur le login du package
    'submit .formLogIn' : function(event){
        event.preventDefault();
        let emailVar = event.target.loginEmail.value;
        let passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar);
        Session.set('logedIn', true);
    },
    //En cliquant ce bouton, le formulaire disparait.
    'click .retour' : function(){
        Session.set('signingIn', false);
    }
});

Template.barre_navigation.helpers({
    'logedIn' : function(){
        let logedIn = Session.get('logedIn');
        return logedIn;
    }
});

Template.barre_navigation.events({
    'click .logOut' : function(){
        Session.set('logedIn', false);
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
            Accounts.createUser({email: $('[id="email_adress"]').val(),password: $('[id="password"]').val()});
            //La méthode qui créera le profil lié à l'utilisateur
            Meteor.call('creerUtilisateur', newUserData);

            //L'utilisateur est automatiquement loged in quand il crée son compte.
            Session.set('logedIn', true);
            Session.set('signingIn', false);
        }
        else{
            //Dans un second temps il faudra prendre en compte tous les champs et afficher les remarques directement sur les champs qui posent problèmes
            alert("Le mot de passe ne correspond pas à la vérification !")
        }
    }
});