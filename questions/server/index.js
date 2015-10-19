Meteor.startup(function () {

	Lyrics = new Mongo.Collection("lyrics");
	if (Lyrics.find().count() === 0) {
		console.log('initializing db');

		var fs = Npm.require('fs');
		//TODO: find a saner path to read the fixture
		//current path is coming from .meteor/local/build/..etc..
		var contents = fs.readFileSync('../../../../../private/fixtures', {encoding: 'utf8'});

		var json = JSON.parse(contents);
		_.each(json,function(lyric){
			Lyrics.insert(lyric);
		});
	}
});
