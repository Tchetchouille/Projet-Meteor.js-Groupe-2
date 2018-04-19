import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './body.html';
import './templates/formulaire_profil.html';




//INSCRIPTION 

Template.formulaire_inscription_profil.helpers({
    //signingIn permet d'afficher des choses différentes en fonction de si la personne remplit le formulaire d'inscription ou non.
    'signingIn' : function(){
        let signingIn = Session.get('signingIn');
        return signingIn;
    }
});

Template.formulaire_inscription_profil.events({
    //En cliquant ce bouton, on affiche le formulaire
    'click .signIn' : function(){
        Session.set('signingIn', true);
    },
    //En cliquant ce bouton, le formulaire disparait.
    'click .retour' : function(){
        Session.set('signingIn', false);
    },
    'submit .formulaire_inscription_profil' : function(event){
        //Pour ne pas recharger la page
        event.preventDefault();
        //créer les variables pour manipuler les valeurs récupérées
        let nom = $('[id=name]').val();
        let prenom = $('[id=firstName]').val();
        let email =  $('[id=email_adress]').val();
        let mot_de_passe =  $('[id=password]').val();
        let universite =  $('[id=university]').val();
        let domaine =  $('[id=branch]').val();   
        
        //Je suis en train d'essayer de bricoler pour pouvoir ajouter les valeurs
        let userId = Accounts.createUser({
            email: email,
            password: mot_de_passe,
        });
        console.log(userId);
        Meteor.call('creerUtilisateur', userId);
    }
});

