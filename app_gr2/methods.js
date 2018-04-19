/*
Après la création de l'utilisateur, ajoute les autres champs d'information
Problème 1 : Il y a un délai lors de la création de l'utilisateur. La méthode se lance avant qu'il ne soit créé. Donc findOne retourne undefined.
Problème 2 : Actuellement, un changement est opéré mais ça "flash". Il apparait et disparait une fraction de seconde plus tard...
*/
Meteor.methods({
    'creerUtilisateur': function(newUserData){
        console.log('La méthode marche');
        
        /*
        Alors ce code fait qqch de bizarre. 
        La valeur apparait dans le document mais elle disparait une fraction de seconde après... 
        Je suppose que ça doit être que le client n'a pas la possibilité de changer cette valeur. 
        Pourtant je suis dans une methode et en plus on a insecure...
        */
        let petiteIdee = Meteor.users.findOne({"emails.address": "test@test.com"}, {_id: 1});
        console.log(petiteIdee);
        Meteor.users.update(petiteIdee, {$set: {ceci: "cela"}});
    },
  });