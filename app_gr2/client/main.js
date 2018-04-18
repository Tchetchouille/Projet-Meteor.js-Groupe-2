import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//Je met ça là pour l'instant
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
    //En cliquant ce bouton, on affiche(ra) le login
    'click .retour' : function(){
        Session.set('signingIn', false);
    },
    'submit form' : function(event){
        //Pour ne pas recharger la page
        event.preventDefault();
        //Il faudra que je crée la méthode pour ajouter un document
    }
});