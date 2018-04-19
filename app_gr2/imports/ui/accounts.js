import { Meteor } from 'meteor/meteor';
import {Template} from 'meteor/templating'

import './formulaire_profil.html';

Template.formulaire_modification_profil.events({
    'submit .form_modification': function(event){
        // Première base : Créer les variables 
        event.preventDefault();

        nom = $('#Nom').val(),
        prenom = $('#Prénom').val(),
        universite = $('#Université').val();

        console.log(nom, prenom, universite)

        // Ensuite :
        Accounts.createUser({
            Nom: nom,
            Prenom: prenom,
            Université: universite
        });   
    }
});