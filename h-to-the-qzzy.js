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

function uncheckAllQuestions(){
      console.log('unchecking');
      // use attr selector to to select only the checked one and uncheck it
      $(".question input").map(function(i,elem){ 
        $(elem).attr('checked',false);
      });
}
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('totalAttempts', 0);
  Session.setDefault('totalCorrect', 0);
  
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
    },
    totalAttempts: function(){
      return Session.get("totalAttempts");
    },
    totalCorrect: function(){
      return Session.get("totalCorrect");
    }
  });

  Template.question.events({

    "change .question": function (event){
      console.log('changed!')
        var current = Session.get("currentLyric");
        Session.answer = current.artist;

        if( event.target.value == current._id.toString()){
          console.log("Correct@!");
          Session.set("correctness", "CORRECT!");
          Session.set("totalCorrect", Session.get("totalCorrect")+1);
        } else {
          console.log("No Match :(");
          Session.set("correctness", "No Match :(");
        }
        Session.set("totalAttempts", Session.get("totalAttempts")+1);

        // reset the board
        setTimeout(function(){
          Session.set("answer", '');
          Session.set("correctness", '');
          uncheckAllQuestions();
          getAndSetRandomLyric();
        }, 1000);

    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
