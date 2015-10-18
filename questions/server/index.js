Meteor.startup(function () {

            Lyrics = new Mongo.Collection("lyrics");
    //if (Lyrics.find().count() === 0) {
     // Lyrics.insert({	artist: "Kanye West",lyric: "Mayonaise colored Benz, I push Miricle Whips"});
    //}
  });
