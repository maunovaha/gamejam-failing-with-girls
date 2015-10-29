var initGameTimeout;
var manDialog = [],
  ladyDialog = [];
var dialogStep = 0;
var answeredQuestionNumber = 0;
var audioPath = "assets/sounds/";
var soundsLoaded = 0;
var soundsList = [{
  id: "labyBgSound",
  src: "labyBg_final.wav"
}, {
  id: "labyStepSound",
  src: "labyStepSound2.wav"
}, {
  id: "discoBgSound",
  src: "discoBg_final.wav"
}, {
  id: "discoSuccess",
  src: "discoSuccess_final.wav"
}, {
  id: "discoFailure",
  src: "discoFailure_final.wav"
}, {
  id: "menuSound",
  src: "menu_final.wav"
}, {
  id: "gameEndSound",
  src: "gameEnd_final.wav"
}];

var soundLoops = {
  "menuSound": undefined,
  "discoBgSound": undefined,
  "labyBgSound": undefined
};

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
  /*
  var winWidth = {
    w: $(window).width(),
    h: $(window).height()
  };

  var mainCanvas = {
    x: (winWidth.w / 2) - (640 / 2),
    y: (winWidth.h / 2) - ((480 / 2) + 80)
  };
  */

  $('#discoScreen, #c, #startScreen, #failScreen, #endScreen').css({
    position: "absolute",
    top: 0 + "px",
    left: 0 + "px"
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

function loadSoundsAndStart() {

  // if initializeDefaultPlugins returns false, we cannot play sound in this browser
  if (!createjs.Sound.initializeDefaultPlugins()) {
    return;
  }

  createjs.Sound.alternateExtensions = ["ogg"];
  createjs.Sound.addEventListener("fileload", handleLoad);
  createjs.Sound.registerSounds(soundsList, audioPath);

}

function startGame() {

  $('#bubble_man ul li').click(function(e) {

    answeredQuestionNumber = $(this).data("question");

    if (answeredQuestionNumber === manDialog[dialogStep]['v']) {
      // ok
      soundLoops["discoBgSound"].stop();

      var playDiscoSuccess = createjs.Sound.play("discoSuccess");
      playDiscoSuccess.on("complete", function(event) {

        soundLoops["discoBgSound"] = createjs.Sound.play("discoBgSound", {
          loop: -1
        });

      });

    } else {
      // bad
      soundLoops["discoBgSound"].stop();
      createjs.Sound.play("discoFailure");
    }

    $('#bubble_man ul').fadeOut('slow', function() {
      $('#bubble_man').fadeOut('slow', function() {
        $('#bubble_man ul li').html("");
        popDialog("woman");
      });
    });

  });

  var initGameTimeout = setTimeout(function() {


    $('#startScreen').fadeIn('slow', function() {
      // Animation complete.
      $('#startButton').fadeIn('slow');

      soundLoops["menuSound"] = createjs.Sound.play("menuSound", {
        loop: -1
      });

    });

    $('#startButton').click(function() {

      soundLoops["menuSound"].stop();
      createjs.Sound.play("discoSuccess");

      $('#startScreen').fadeOut('slow', function() {
        // Animation complete.
        $(this).css("display", "none");
        $('#startButton').css("display", "none");
        startDisco();
      });
    });

    $('#failButton').click(function() {

      var playSuccess = createjs.Sound.play("discoSuccess");
      playSuccess.on("complete", function(event) {
        document.location.reload(true);
      }, this);

    });

  }, 1000);

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

  soundLoops["discoBgSound"].stop();
  soundLoops["labyBgSound"] = createjs.Sound.play("labyBgSound", {
    loop: -1
  });

  $('#c').fadeIn('slow', function() {
    GameLoop();
    stepClock();
  });

}

function startDisco() {

  $('#discoScreen').fadeIn('slow', function() {

    $('#woman').fadeIn('slow', function() {
      $('#man').fadeIn('slow', function() {

        soundLoops["discoBgSound"] = createjs.Sound.play("discoBgSound", {
          loop: -1
        });

        popDialog("man");

      });
    });

  });

}

function handleLoad(event) {
  soundsLoaded++;

  if (soundsLoaded === soundsList.length) {
    startGame();
  }

}

$(function() {

  alignDivs();
  loadSoundsAndStart();

  $(window).resize(function() {
    alignDivs();
  });
});