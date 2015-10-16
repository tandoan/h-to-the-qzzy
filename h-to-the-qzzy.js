Lyrics = new Mongo.Collection("lyrics");

function getRandomLyric(){
  var arr = Lyrics.find().fetch();
  var randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
function getAndSetRandomLyric(){
  var lyric = getRandomLyric();
  Session.set("currentLyric", lyric);
}

if (Meteor.isClient) {

  Template.question.helpers({
   lyric: function(){
      var l = Session.get("currentLyric" ) 
      if(!l){
        getAndSetRandomLyric();
        l = Session.get("currentLyric" ) 
      }
      return l;
   }, 
    choices: function(){
      return Lyrics.find({});
    },
    answer: function(){
      return Session.get("answer");
    },
    correctness: function(){
      return Session.get("correctness");
    }
  });

  Template.question.events({
    "change .question": function (event){
        var current = Session.get("currentLyric");
        Session.answer = current.artist;

        if( event.target.value == current._id.toString()){
          console.log("Correct@!");
          Session.set("correctness", "CORRECT!");
        } else {
          console.log("No Match :(");
          Session.set("correctness", "No Match :(");
        }
        setTimeout(function(){
          Session.set("answer", '');
          Session.set("correctness", '');
          getAndSetRandomLyric();
        }, 500);

    }
  })

  // counter starts at 0
  Session.setDefault('counter', 0);
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
