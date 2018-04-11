import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import import './formulaire_profil.html';

Template.formulaire_profil.events({
'submit form': function(){
// Première base : Créer les variables 

nom = $('#Nom').val(),
prenom = $('#Prénom').val(),
universite = $('#Université').val(),
password = $('#password').val(),
phone = $('phone').val();

// Ensuite :
Accounts.createUser({
    email: email,
    firstname: firstName,
    lastname: lastName,
    institute: institute,
    password: password,
    phone: phone,
    sw : true
}
});