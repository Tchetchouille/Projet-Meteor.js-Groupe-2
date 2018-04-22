
Meteor.methods({
    //Je remplis une autre collection puisque c'est visiblement impossible avec users.
    'creerUtilisateur': function(newUserData){
        //Pour pouvoir utiliser l'_id de l'utilisateur comme foreign key
        let userId = Meteor.users.find({'emails.address': 'test@test.com'}).fetch();

        console.log(userId);
        
        ProfilesUtilisateurs.insert({
            userId: userId[0]._id,
            nom: newUserData.nom,
            prenom: newUserData.prenom,
            email: newUserData.email,
            universite: newUserData.universite,
            domaine: newUserData.domaine
        });
    },
  });