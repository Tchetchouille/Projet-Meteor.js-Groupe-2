import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base';

import './formulaire_profil.html';

Template.formulaire_modification_profil.events({
    'click .form_modification': function(event){
        // Première base : Créer les variables 
        event.preventDefault();

        nom = $('#Nom').val(),
        prenom = $('#Prénom').val(),
        universite = $('#Uni').val();
        branche = $('#Branche').val();


        console.log(nom, prenom, universite)

        // Ensuite :
        Accounts.createUser({
            Nom: nom,
            Prenom: prenom,
            Université: universite
            Branche : branche
        });   
    }
});