import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


// INSCRIPTION
/*
Accounts.onCreateUser((options, user) => {
  user.test = 'test';
  console.log('wtf?');

  if (options.profile) {
    user.profile = options.profile;
  }

  return user;
});
*/
