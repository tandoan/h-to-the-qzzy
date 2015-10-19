Lyrics = new Mongo.Collection("lyrics");
var animationInterval;
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

function disableAllQuestions(){
  $(".question input").attr('disabled',true);
}

function enableAllQuestions(){
  $(".question input").attr('disabled',false);
}

function animateResultBlock(element,interval){
  var currentOpacity = element.style.opacity;
  var newOpacity;

  if(currentOpacity > 0){
    newOpacity = currentOpacity - .1;
    element.style.opacity = newOpacity;
  } else {
    element.style.opacity = 1;
    Session.set("answer", '');
    Session.set("correctness", '');
    enableAllQuestions();
    uncheckAllQuestions();
    getAndSetRandomLyric();    
    clearInterval(animationInterval);
  }
}

function resetAndGetNewQuestion(){
  var resultBlock = document.getElementById('answer-span');
  var animation = animateResultBlock.bind(null,resultBlock);
  animationInterval = setInterval(animation,100);
}

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
            console.log('chices');
            var choices = [];
            var current = getCurrentLyric() 
            choices.push(current);
            console.log('current',current);

            var c = Lyrics.find({artist: {$ne: current.artist}}).fetch();
            c = _.shuffle(c);
            choices.push(c.shift());
            choices.push(c.shift());
            choices.push(c.shift());

      return _.shuffle(choices);
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
        Session.set("answer", current.artist);

        if( event.target.value == current._id.toString()){
          console.log("Correct@!");
          Session.set("correctness", "CORRECT!");
          Session.set("totalCorrect", Session.get("totalCorrect")+1);
        } else {
          console.log("No Match :(");
          Session.set("correctness", "No Match :(");
        }
        Session.set("totalAttempts", Session.get("totalAttempts")+1);
        disableAllQuestions();
        // reset the board
        setTimeout(resetAndGetNewQuestion, 1000);

    }
  })
//if (Meteor.isServer) {
//  Meteor.startup(function () {
//    // code to run on server at startup
//  });
//}
