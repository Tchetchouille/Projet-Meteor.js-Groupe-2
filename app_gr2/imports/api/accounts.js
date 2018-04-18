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

<<<<<<< HEAD
// Ensuite :
Accounts.createUser({
    Nom: nom,
    Prenom: prenom,
    Université: universite,
}
});

// et ça rajoute tout ça dans la base de données  
=======
        // Ensuite :
        Accounts.createUser({
            Nom: nom,
            Prenom: prenom,
            Université: universite
        });
    }
});
>>>>>>> 64745cd9a4b6f99eed1310ad183e4452d5d58a95
