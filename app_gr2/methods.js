/*
Après la création de l'utilisateur, ajoute les autres champs d'information
Problème 1 : Il y a un délai lors de la création de l'utilisateur. La méthode se lance avant qu'il ne soit créé. Donc findOne retourne undefined.
Problème 2 : Actuellement, un changement est opéré mais ça "flash". Il apparait et disparait une fraction de seconde plus tard...
*/
Meteor.methods({
    'creerUtilisateur': function(newUserData){
        //Pour pouvoir utiliser l'_id de l'utilisateur comme foreign key
        let userId = Meteor.users.findOne({"emails.address": 'newUserData.email'}, {_id: 1});

        ProfilesUtilisateurs.insert({
            userId: userId,
            nom: newUserData.nom,
            prenom: newUserData.prenom,
            email: newUserData.email,
            mot_de_passe: newUserData.mot_de_passe,
            universite: newUserData.universite,
            domaine: newUserData.domaine
        });
        //Pour faire disparaître le template d'inscription une fois l'inscription faite.
        Session.set('logedIn', true);
    },
  });