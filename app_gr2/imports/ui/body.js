<<<<<<< HEAD
=======

<<<<<<< HEAD
=======
>>>>>>> 45d278643a62498ac03864cc435d91b491bd50ba
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './body.html';
import './formulaire_profil.html';


//Je met ça là pour l'instant
Template.formulaire_inscription_profil.helpers({
    //signingIn permet d'afficher des choses différentes en fonction de si la personne remplit le formulaire d'inscription ou non.
    'signingIn' : function(){
        let signingIn = Session.get('signingIn');
        return signingIn;
    }
});

<<<<<<< HEAD
Template.formulaire_inscription_profil.events({
    //En cliquant ce bouton, on affiche le formulaire
    'click .signIn' : function(){
        Session.set('signingIn', true);
    },
    //En cliquant ce bouton, on affiche(ra) le login
    'click .retour' : function(){
        Session.set('signingIn', false);
    },
    'submit .formulaire_inscription' : function(event){
        //Pour ne pas recharger la page
        event.preventDefault();
        //Il faudra que je crée la méthode pour ajouter un document dans la collection
    }
});
=======
>>>>>>> a630e0ce4961e47dc02d81211713fa802c8785c1
import './formulaire_profil.html';
>>>>>>> 45d278643a62498ac03864cc435d91b491bd50ba
