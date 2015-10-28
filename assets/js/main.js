var labyBgSound, labyStepSound, labyStepSoundWoman, discoBgSound, discoSuccess, discoFailure, initGameTimeout, gameEndSound;
var manDialog = [],
  ladyDialog = [];
var dialogStep = 0;
var answeredQuestionNumber = 0;

manDialog[0] = {
  q: [
    "Wow, nice ass!",
    "Are your parents clams cause you are such a pearl?",
    "Can I have your autograph?"
  ],
  v: 2
};

ladyDialog[0] = [
  "Yea, but keep walking boy..",
  "NO! and my parents has passed away.. *sigh*",
  "Sure, but why? :>"
];

manDialog[1] = {
  q: [
    "Because, you look like celebrity.",
    "So that I can add it to my collection.",
    "..just because.."
  ],
  v: 0
};

ladyDialog[1] = [
  "Ohh, you think so? thats awesome! *duckface*",
  "What?! no way, pervert.!",
  "..Because? .. im leaving.. *farts*"
];

manDialog[2] = {
  q: [
    "Hey.. What was your name again?",
    "Hmm.. Wanna come to my place for a cup of tee?",
    "Did I forgot to mention that im a programmer?"
  ],
  v: 2
};

ladyDialog[2] = [
  "Huh, are you a cop or something?. JERK!",
  "No. I dont even know who you are.",
  "Mmm.. you surely did, Im Lisa Blondah - nerds are HOT!"
];

manDialog[3] = {
  q: [
    "Its getting late.. can I come over to your place?",
    "Its getting late.. can I have last dance of the evening?",
    "You have gigantic boobs, shall we go to your place?"
  ],
  v: 2
};

ladyDialog[3] = [
  "Maybe later, good song just started to play..",
  "No. you dont look like a person who can handle dubstep.",
  "*Grrrr* of course - meet me at DarkStreet 14 A"
];

function alignDivs() {

  // positions for divs
  var winWidth = {
    w: $(window).width(),
    h: $(window).height()
  };

  var mainCanvas = {
    x: (winWidth.w / 2) - (640 / 2),
    y: (winWidth.h / 2) - ((480 / 2) + 80)
  };

  $('#discoScreen, #c, #startScreen, #failScreen, #endScreen').css({
    position: "absolute",
    top: mainCanvas.y + "px",
    left: mainCanvas.x + "px"
  });

  $('#bubble_man').css({
    position: "absolute",
    top: 10 + "px",
    left: 40 + "px"
  });

  $('#bubble_woman').css({
    position: "absolute",
    bottom: 70 + "px",
    right: 166 + "px"
  });

}

function clearInitGameTimeout() {
  clearTimeout(initGameTimeout);
}

function startGame() {

  // if initializeDefaultPlugins returns false, we cannot play sound in this browser
  if (!createjs.Sound.initializeDefaultPlugins()) {
    return;
  }

  var audioPath = "assets/sounds/";
  var sounds = [{
    id: "Music",
    src: "menu_final.ogg"
  }];

  createjs.Sound.alternateExtensions = ["mp3"];
  createjs.Sound.addEventListener("fileload", handleLoad);
  createjs.Sound.registerSounds(sounds, audioPath);

  $(function() {

    alignDivs();

    $('#bubble_man ul li').click(function(e) {

      answeredQuestionNumber = $(this).data("question");

      if (answeredQuestionNumber === manDialog[dialogStep]['v']) {
        // ok
        /*
        discoBgSound.stop();
        discoSuccess.play({
          onfinish: function() {
            loopSound('discoBgSound');
          }
        });
        */
      } else {
        // bad
        // discoBgSound.stop();
        // discoFailure.play();
      }

      $('#bubble_man ul').fadeOut('slow', function() {
        $('#bubble_man').fadeOut('slow', function() {
          $('#bubble_man ul li').html("");
          popDialog("woman");
        });
      });

    });

    initGameTimeout = setTimeout(function() {

      $(function() {

        $('#startScreen').fadeIn('slow', function() {
          // Animation complete.
          $('#startButton').fadeIn('slow');

          // loopSound('menuSound');

        });

        $('#startButton').click(function() {

          // menuSound.stop();
          // discoSuccess.play();

          $('#startScreen').fadeOut('slow', function() {
            // Animation complete.
            $(this).css("display", "none");
            $('#startButton').css("display", "none");
            clearInitGameTimeout();
            startDisco();
          });
        });

        $('#failButton').click(function() {

          discoSuccess.play({
            onfinish: function() {
              document.location.reload(true);
            }
          });

        });

      });

    }, 1000);

  });

}

function popDialog(sex) {

  // check if steps left, if not go to labyrinth etc..

  if (sex === "man") {

    $('#bubble_man').fadeIn('slow', function() {

      // get questions based on step and fill the div
      var manObj = manDialog[dialogStep];

      for (var uu = 1; uu < manObj['q'].length + 1; uu++) {
        $('#bubble_man ul li:nth-child(' + uu + ')').append("&raquo; " + manObj['q'][uu - 1]);
      }

      // fading in..
      $('#bubble_man ul').fadeIn('slow');
    });

  } else {

    // todolist: 
    // credits
    // arrow keys tips for labyrinth
    // woman image in labyrinth running and fayding?
    // moment later ending screen..

    $('#bubble_woman').fadeIn('slow', function() {

      var womanArr = ladyDialog[dialogStep];

      $('#bubble_woman p').html("- " + womanArr[answeredQuestionNumber]);

      dialogStep++;

      var duration = 4000;
      if (dialogStep === manDialog.length) {
        duration = 5000;
      }

      $('#bubble_woman').fadeOut(duration, function() {
        $('#bubble_woman p').html("");

        var gameLost = (answeredQuestionNumber != manDialog[dialogStep - 1]['v']);

        if (gameLost) {

          // discoBgSound.stop();
          $('#woman').fadeOut(700, function() {

            $('#discoScreen').fadeOut('slow', function() {
              // Animation complete.
              $(this).css("display", "none");
              $('#bubble_woman').css("display", "none");
              $('#bubble_man').css("display", "none");
              // etc...
              $('#failScreen').fadeIn('slow', function() {
                $('#failButton').fadeIn('slow');
              });

            });

          });

        } else if (dialogStep === manDialog.length) {

          $('#woman').fadeOut(700, function() {

            $('#man').fadeOut(700, function() {

              // fade everything away etc.. set state flag? half through!
              $('#discoScreen').fadeOut('slow', function() {
                // Animation complete.
                $(this).css("display", "none");
                $('#bubble_woman').css("display", "none");
                $('#bubble_man').css("display", "none");
                // etc...

                startLabyrinth();

              });

            });

          });

        } else {
          popDialog("man");
        }


      });



    });


  }


}

function startLabyrinth() {

 //  discoBgSound.stop();
  // loopSound('labyBgSound');

  $('#c').fadeIn('slow', function() {
    GameLoop();
    stepClock();
  });

}

function startDisco() {

  $(function() {

    $('#discoScreen').fadeIn('slow', function() {

      $('#woman').fadeIn('slow', function() {
        $('#man').fadeIn('slow', function() {

          // loopSound('discoBgSound');
          popDialog("man");

        });
      });

    });

  });

}

/*
soundManager.setup({
  url: 'swf/',
  onready: function() {
    labyBgSound = soundManager.createSound({
      id: 'labyBgSound',
      url: 'sounds/labyBg_final.ogg'
    });
    labyStepSound = soundManager.createSound({
      id: 'labyStepSound',
      url: 'sounds/labyStepSound2.wav'
    });
    labyStepSoundWoman = soundManager.createSound({
      id: 'labyStepSoundWoman',
      url: 'sounds/labyStepSound2.wav'
    });
    discoBgSound = soundManager.createSound({
      id: 'discoBgSound',
      url: 'sounds/discoBg_final.ogg'
    });
    discoSuccess = soundManager.createSound({
      id: 'discoSuccess',
      url: 'sounds/discoSuccess_final.ogg'
    });
    discoFailure = soundManager.createSound({
      id: 'discoFailure',
      url: 'sounds/discoFailure_final.ogg'
    });
    menuSound = soundManager.createSound({
      id: 'menuSound',
      url: 'sounds/menu_final.ogg'
    });
    gameEndSound = soundManager.createSound({
      id: 'gameEndSound',
      url: 'sounds/gameEnd_final.ogg'
    });

    startGame();
    //startLabyrinth();

  },
  ontimeout: function() {
    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
    alert('Try different browser since your sounds doesnt work!');
  }
});
*/

function loopSound(soundID) {
  /*
  window.setTimeout(function() {
    soundManager.play(soundID, {
      onfinish: function() {
        loopSound(soundID);
      }
    });
  }, 1);
  */
}

function handleLoad(event) {

  console.log("handleload called!");

  createjs.Sound.play(event.src);
}

$(function() {
  $(window).resize(function() {
    alignDivs();
  });

  startGame();
});