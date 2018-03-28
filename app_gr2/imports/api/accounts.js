import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Accounts.onCreateUser((options, user) => {
    user.nom: '';
    user.prenom: '';£
    user.uni : '';
    user.branche :'';

    if(options.profile){
        user.profile = options.profile;
    }

    return user;
});