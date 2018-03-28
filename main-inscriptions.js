import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './templates/pages_inscription.html';
Template.register.events({
	"submit form": function(e, template) {
	e.preventDefault();

	var username = $('input[name="username"]').value;
	var email = $('input[name="email"]').value;
	var password = $('input[name="password"]').value;
	var profile = {
			//Nom, Prénom, Institut, Domaine....
				   
	};

	var user = {
		username: username,
		email: email,
		password: password,
		profile: profile
	};

	Accounts.createUser(user, function(err) { 
		if (err) {
			alert(err.reason)
		} 
	});
}
});