Meteor.methods({
    'creerUtilisateur': function(userId){
        console.log('La méthode marche');
        Meteor.users.update(
            {_id: userId}, 
            {$set: {emails:{ adress: 'caMarche@test.com'}}});
    } 
});