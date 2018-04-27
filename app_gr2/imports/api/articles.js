import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';

import { ReactiveVar } from 'meteor/reactive-var';
import { loadavg } from 'os';

let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
};


export const Images = new FilesCollection({
    collectionName: 'Images',
    allowClientCode: false,
    debug: Meteor.isServer && process.env.NODE_ENV === 'development',
    onAfterUpload(image) {
      // Move file to GridFS
      Object.keys(image.versions).forEach(versionName => {
        const metadata = { versionName, imageId: image._id, storedAt: new Date() }; // Optional
        const writeStream = gfs.createWriteStream({ filename: image.name, metadata });
  
        fs.createReadStream(image.versions[versionName].path).pipe(writeStream);
  
        writeStream.on('close', Meteor.bindEnvironment(file => {
          const property = `versions.${versionName}.meta.gridFsFileId`;
  
          // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
          // LocalCollection.ObjectID, which GFS doesn't understand.
          this.collection.update(image._id, { $set: { [property]: file._id.toString() } });
          this.unlink(this.collection.findOne(image._id), versionName); // Unlink files from FS
        }));
      });
    },
    interceptDownload(http, image, versionName) {
      // Serve file from GridFS
      const _id = (image.versions[versionName].meta || {}).gridFsFileId;
      if (_id) {
        const readStream = gfs.createReadStream({ _id });
        readStream.on('error', err => { throw err; });
        readStream.pipe(http.response);
      }
      return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
    },
    onAfterRemove(images) {
      // Remove corresponding file from GridFS
      images.forEach(image => {
        Object.keys(image.versions).forEach(versionName => {
          const _id = (image.versions[versionName].meta || {}).gridFsFileId;
          if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
        });
      });
    }
  
  });
  
  
  if(Meteor.isClient){
	Template.uploadForm.onCreated(function () {
	  this.currentUpload = new ReactiveVar(false);
	});
	
	Template.uploadForm.helpers({
	  currentUpload() {
		return Template.instance().currentUpload.get();
	  }
	});
	
	Template.uploadForm.events({
	  'change #fileInput'(e, template) {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
		  // We upload only one file, in case
		  // multiple files were selected
		  const upload = Images.insert({
			file: e.currentTarget.files[0],
			streams: 'dynamic',
			chunkSize: 'dynamic'
		  }, false);
	
		  upload.on('start', function () {
			template.currentUpload.set(this);
		  });
	
		  upload.on('end', function (error, fileObj) {
			if (error) {
			  alert('Error during upload: ' + error);
			} else {
			  alert('File "' + fileObj.name + '" successfully uploaded');
			}
			template.currentUpload.set(false);
		  });
	
		  upload.start();
		}
	  }
	});
	};