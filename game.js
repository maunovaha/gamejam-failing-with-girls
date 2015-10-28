var width = 640, height = 480, gLoop, state = true, c = document.getElementById('c'), initialized = false, ctx = c.getContext('2d');;

c.width = width;
c.height = height;

var pressedKey = [];

var arrs = [];
arrs[37] = 'left';
arrs[38] = 'up';
arrs[39] = 'right';
arrs[40] = 'down';

var timeLeft = 35;
var timeTracker;

var map2D = [ 
    ["o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o"], 
    ["o","x","x","x","x","x","o","x","x","x","o","x","o","x","o","x","x","x","x","o"], 
    ["o","x","o","x","o","x","o","x","o","x","x","x","o","x","o","x","o","o","x","o"], 
    ["o","o","o","o","o","x","o","x","o","o","o","x","o","x","o","x","o","x","x","o"], 
    ["o","x","x","x","o","x","o","x","o","x","x","x","x","x","o","x","o","x","x","o"], 
    ["o","x","o","o","o","x","o","x","o","x","o","o","x","o","o","x","o","o","x","v"], 
    ["o","x","x","x","o","x","o","x","o","x","x","o","x","o","x","x","x","o","x","o"], 
    ["o","x","o","x","x","x","o","x","o","o","x","o","x","o","o","o","x","o","x","o"], 
    ["o","x","o","o","x","o","x","x","x","o","x","o","x","o","x","x","x","o","o","o"], 
    ["o","x","x","o","x","x","x","o","x","x","x","o","x","o","x","o","x","x","x","o"], 
    ["o","x","o","o","o","x","o","o","o","o","x","x","x","o","x","o","x","o","x","o"], 
    ["o","x","x","x","o","x","x","o","x","x","x","o","x","o","x","o","x","o","x","o"], 
    ["o","x","o","o","o","x","o","o","o","o","o","o","x","o","o","o","o","o","x","o"], 
    ["x","x","x","x","o","x","o","x","x","x","x","x","x","x","x","x","x","x","x","o"], 
    ["o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o"], 
];

var mapWall = new Image();
mapWall.src = "tile.png";
mapWall.width = 32;
mapWall.height = 32;

var mapGround = new Image();
mapGround.src = "ground.png";
mapGround.width = 32;
mapGround.height = 32;

var mapGoal = new Image();
mapGoal.src = "house.png";
mapGoal.width = 32;
mapGoal.height = 32;

var girlImg = new Image();
girlImg.src = "woman_small.png";
girlImg.width = 32;
girlImg.height = 32;

/**
 *
 */
var clear = function(){
	ctx.fillStyle = '#000';
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.closePath();
	ctx.fill();
}


var pixelPositionToGridPosition = function(x, y, width) {
	return [ x / width, y / width ];
}


var DrawMap2D = function() {
	
	var visibleAreaArray = [];
	var playerGridPos = pixelPositionToGridPosition(player.X, player.Y, player.image.width);
	var bgStartPos = [playerGridPos[0]-1, playerGridPos[1]-1];
	
	// maximum visible viewport around player
	for(var z = bgStartPos[0]; z < bgStartPos[0]+3; z++) {
		for(var e = bgStartPos[1]; e < bgStartPos[1]+3; e++) {
		
			if(z >= 0 && z <= 19 && e >= 0 && e <= 14) {
			    visibleAreaArray.push(
				{
					x: z,
					y: e,
					type: map2D[e][z]
				}
			    );  
			}
		}
	}	
		
	for(var i=0; i < visibleAreaArray.length; i++) {


		if(visibleAreaArray[i].type === "o") {
			try {
				ctx.drawImage(mapWall, 0, 0, mapWall.width, mapWall.height, 0 + (visibleAreaArray[i].x * mapWall.width), 0 + (visibleAreaArray[i].y * mapWall.height), mapWall.width, mapWall.height);
			}
			catch (e) {
				console.log(e);
			}
		} else if(visibleAreaArray[i].type === "x") {
			try {
				ctx.drawImage(mapGround, 0, 0, mapGround.width, mapGround.height, 0 + (visibleAreaArray[i].x * mapGround.width), 0 + (visibleAreaArray[i].y * mapGround.height), mapGround.width, mapGround.height);
			}
			catch (e) {
				console.log(e);
			}
		} else if(visibleAreaArray[i].type === "v") {
			try {
				ctx.drawImage(mapGoal, 0, 0, mapGoal.width, mapGoal.height, 0 + (visibleAreaArray[i].x * mapGoal.width), 0 + (visibleAreaArray[i].y * mapGoal.height), mapGoal.width, mapGoal.height);
			}
			catch (e) {
				console.log(e);
			}
		}
		
	}
	
	visibleAreaArray = [];
}


var player = new (function(){

	var that = this;
	that.image = new Image();
	that.image.src = "man_small.png";
	that.width = 32;
	that.height = 32;
	
	that.X = 0;
	that.Y = 416;	
	
	that.imageShadow = new Image();
	that.imageShadow.src = "dark.png";
	that.imageShadow.width = 96;
	that.imageShadow.height = 96;

	
	/**
 	*
 	*/
	that.setPosition = function(x, y){
		that.X = x;
		that.Y = y;
		
		// play only if not playing?
		labyStepSound.play();
	}
	
	/**
	 *
	 */
	 
	that.givenPositionFree = function(x, y) {
		
		var playerPos2D = pixelPositionToGridPosition(x,y, that.image.width);

		if(map2D[playerPos2D[1]][playerPos2D[0]] === "o") {
			return false;
		} else if (map2D[playerPos2D[1]][playerPos2D[0]] === "v") { // checking for goal!
			GameFinished("victory");
			return true;
		}

		return true;
	}
	
	
	/**
	 *
	 */
	that.update = function(){

		if (pressedKey.length > 0) {
		
			console.log(that.X, that.Y);
			console.log(pixelPositionToGridPosition(that.X, that.Y, that.image.width));
			console.log(that.givenPositionFree(that.X, that.Y));
			
			if(arrs[pressedKey] === 'left' && that.X > 0 && that.givenPositionFree(that.X - that.image.width, that.Y)) { // left
				that.setPosition(that.X - that.image.width, that.Y);
			} else if(arrs[pressedKey] === 'right' && that.givenPositionFree(that.X + that.image.width, that.Y)){ // right
				that.setPosition(that.X + that.image.width, that.Y);
			} else if(arrs[pressedKey] === 'up' && that.givenPositionFree(that.X, that.Y - that.image.height)) { // up
				that.setPosition(that.X, that.Y - that.image.height);
			} else if(arrs[pressedKey] === 'down' && that.givenPositionFree(that.X, that.Y + that.image.height)){ // down
				that.setPosition(that.X, that.Y + that.image.height);
			}		
			
			console.log("next pos as slot: " + (that.X / that.image.width) + " y: " + (that.Y / that.image.height));
			
			pressedKey = [];
		}
		
	}

	/**
 	*
 	*/
	that.draw = function(){
		try {
			ctx.drawImage(that.image, 0, 0, that.width, that.height, that.X, that.Y, that.width, that.height);
			ctx.drawImage(that.imageShadow, 0, 0, that.imageShadow.width, that.imageShadow.height, that.X-that.image.width, that.Y-that.image.width, that.imageShadow.width, that.imageShadow.height);
		}
		catch (e) {}
	};
	
	
})();


function checkArrowKeys(e){

    var key = window.event ? event.keyCode: e.keyCode;
    
    // if some of the arrows pressed
    if(arrs[key]) {
    	pressedKey = [];
    	pressedKey.push(key);
    } 
}

document.onkeydown = checkArrowKeys;

function stopClock(){

  clearTimeout(timeTracker);
  
}
 
function stepClock(){
  
  timeLeft--;
  
  if (state === true) {
  
  if(timeLeft >= 0) {
  	timeTracker = setTimeout("stepClock()", 1000);
  } else {
  	stopClock();
  	GameFinished("");
  }
  
  }

  
}

var GameLoop = function(){

	clear();
	
	DrawMap2D();
	
	if(initialized === false) {
		labyStepSoundWoman.play();
		initialized = true;
	}
	
	player.draw();
	player.update();
	
	ctx.fillStyle = "White";
	ctx.font = "12pt Arial";
	ctx.fillText("Time to find her house: " + timeLeft + " seconds.", 10, 20);

	if (state)
	gLoop = setTimeout(GameLoop, 1000 / 50);

};

var GameFinished = function(result) {

	state = false;
	clearTimeout(gLoop);

	labyBgSound.stop();
	
	if(result === "victory") {
	
		discoSuccess.play();
		
		$('#c').fadeOut('slow', function() {
    			// Animation complete.
    			$(this).css("display", "none"); 
    			
			$('#endScreen').fadeIn('slow', function() {
			
				gameEndSound.play({
    					onfinish: function() {
      						
      					$('#endScreen').fadeOut('slow', function() {
						window.location.reload(true);
					});	
      						
   					}
  				});
			});		
				
  		});
		
	} else { // you have failed, refresh view etc etc.?
	
		discoFailure.play();
		
		$('#c').fadeOut('slow', function() {
    			// Animation complete.
    			$('#failScreen').fadeIn('slow', function() {
    				$('#failButton').fadeIn('slow');
  			});				
  		});	
		
	}
	
};
  
