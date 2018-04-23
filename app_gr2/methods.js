
Meteor.methods({
    //Je remplis une autre collection puisque c'est visiblement impossible avec users.
    'creerUtilisateur': function(newUserData){
        //Pour pouvoir utiliser l'_id de l'utilisateur comme foreign key
        let currentUserId = Meteor.users.find({'emails.address': 'test@test.com'}).fetch();

        ProfilesUtilisateurs.insert({
            userId: currentUserId[0]._id,
            nom: newUserData.nom,
            prenom: newUserData.prenom,
            email: newUserData.email,
            universite: newUserData.universite,
            domaine: newUserData.domaine
        });
    },
    sendVerificationLink(){
        let userId = Meteor.userId();
        if ( userId ) {
          return Accounts.sendVerificationEmail( userId );
        }
    }
});