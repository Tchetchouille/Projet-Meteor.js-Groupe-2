import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import '../ui/formulaire_profil.html';



Template.formulaire_profil.events({
    'submit form': function(){
        // Première base : Créer les variables 

        nom = $('#Nom').val(),
        prenom = $('#Prénom').val(),
        universite = $('#Université').val(),

        // Ensuite :
        Accounts.createUser({
            Nom: nom,
            Prenom: prenom,
            Université: universite
        });
    }
});