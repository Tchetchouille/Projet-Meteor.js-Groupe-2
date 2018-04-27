import { Template } from 'meteor/templating';

import './body.html';
import './templates/file.html';
import './templates/listeArticles.html';
import './templates/uploadForm.html';

import { Images } from '../api/articles.js';

if(Meteor.isClient){
	Template.listeArticles.helpers({
	  'article': function(){
		return Images.find();
	  },
	  'selectedClass': function(){
		var articleId= this._id;
		var selectedArticle= Session.get('selectedArticle');
		if (articleId == selectedArticle){
			return "selected";
		}
	  },
	  'selectedArticle': function(){
		var selectedArticle=Session.get('selectedArticle');
		return Images.findOne({_id: selectedArticle});
	  }
	});
	
	Template.listeArticles.events({
	  'click .article': function(){
		var articleId= this._id;
		Session.set('selectedArticle', articleId);
		var fsId= this.files_id;
		console.log(fsId);
	  }
	});
	
	Template.file.helpers({
	  'file': function() {
	   var selectedArticle=Session.get('selectedArticle');
	   return Images.findOne({_id: selectedArticle});
	  }
	})
	}


