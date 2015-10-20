Lyrics = new Mongo.Collection("lyrics");
// counter starts at 0
Session.setDefault('counter', 0);
Session.setDefault('totalAttempts', 0);
Session.setDefault('totalCorrect', 0);

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

function resetAndGetNewQuestion(){
  var current = getCurrentLyric();
  var answerLabel = $('label[for=rb_' + current._id.toString() + ']')[0];
  answerLabel = $(answerLabel);

  // TODO: find better way to do this
  answerLabel.css('font-weight',700);
  setTimeout(function(){answerLabel.css('font-weight',600)}, 333);
  setTimeout(function(){answerLabel.css('font-weight',500)}, 666);
  setTimeout(function(){answerLabel.css('font-weight',400)}, 1000);

  setTimeout(function(){
        enableAllQuestions();
        uncheckAllQuestions();
        getAndSetRandomLyric();    
  }, 1000);

}



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
    var choices = [];
    var current = getCurrentLyric() 
    choices.push(current);

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
    var current = getCurrentLyric();

    if( event.target.value == current._id.toString()){
      Session.set("correctness", "CORRECT!");
      Session.set("totalCorrect", Session.get("totalCorrect")+1);
    } else {
      Session.set("correctness", "No Match :(");
    }
    Session.set("totalAttempts", Session.get("totalAttempts")+1);
    disableAllQuestions();

    // reset the board
    resetAndGetNewQuestion();

  }
})
