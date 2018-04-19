import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


// INSCRIPTION

//Cette méthode crée un utilisateur. Ne marche aps pour l'instant.
Meteor.methods({
  'creerUtilisateur': function(newUserData){
      console.log('La méthode marche');
      return Accounts.createUser(newUserData);
  }
});