Lyrics = new Mongo.Collection("lyrics");

function getCurrentLyric(){
  return Session.get("currentLyric");
}

function setCurrentLyric(lyric){
  return Session.set("currentLyric", lyric);
}
function getRandomLyric(){
  var ret,
  current = Session.get("currentLyric"),
  shuffledLyrics = _.shuffle(Lyrics.find().fetch());

debugger;
  if(current){
    do {
      ret = shuffledLyrics.shift();
    } while(ret._id.toString() === current._id.toString());
    console.log(ret,current);
  } else {
      ret = shuffledLyrics.shift();
  }

  return ret;
}

function getAndSetRandomLyric(){
  setCurrentLyric(getRandomLyric());
}

function uncheckAllQuestions(){
  $(".question input:checked").attr('checked',false);
}

function resetAndGetNewQuestion(){
  Session.set("answer", '');
  Session.set("correctness", '');
  uncheckAllQuestions();
  getAndSetRandomLyric();
}

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('totalAttempts', 0);
  Session.setDefault('totalCorrect', 0);
  
  Template.question.helpers({
   lyric: function(){
      var l = getCurrentLyric();
      if(!l){
        getAndSetRandomLyric();
        l = getCurrentLyric();
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
        var current = getCurrentLyric();
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
        setTimeout(resetAndGetNewQuestion, 1000);

    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
