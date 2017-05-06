	
	var hand = null;
	var cursorPosition = [0, 0, 0];
	var originalPosition = [0,0,0];
	var control = new Control();
	var offset = [-280, 280]
	var fingerOffset = [-140, 400];
	var init = true;
	var leapFrame;
	hand =""
	cursorPositionUpdate = function(hand){
		cursorPosition[0] = hand.screenPosition()[0]+offset[0];
		cursorPosition[1] = hand.screenPosition()[1]+offset[1];
		cursorPosition[2] = hand.screenPosition()[2]
	}
	fingerCursorUpdate = function(hand){
		//finger = hand.fingers[1]["tipPosition"];
		finger = hand.fingers[1].screenPosition();
		cursorPosition[0] = finger[0]+fingerOffset[0];
		cursorPosition[1] = finger[1]+fingerOffset[1];
		//cursorPosition[2] = finger[2]
		//console.log(hand.fingers[1]["stabilizedTipPosition"]);
		
		
		originalPosition[0] = hand.screenPosition()[0]+offset[0];
		originalPosition[1] = hand.screenPosition()[1]+offset[1];
		originalPosition[2] = hand.screenPosition()[2]
		
		
	}
	
	checkInFlyout = function(cursorPosition){
		if(cursorPosition[0]<Blockly.mainWorkspace.toolbox_.flyout_.width_+5){
			return true;
		}
		return false;
	}
	
	setVariable = function(){
		control.createVariable('x');
		
		var newBlockSvg = Blockly.mainWorkspace.toolbox_.flyout_.placeNewBlock_(Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[0]);
		control.currentBlock = new Block(newBlockSvg, cursorPosition);
		control.closeFlyout()
		control.currentBlock.blockSvg.select();
		control.currentBlock.blockSvg.moveBy(200,10)
		control.blocks.push(control.currentBlock);
		control.currentBlock = null;
		
	
	}
	
	getVariable = function(){
		Blockly.mainWorkspace.toolbox_.tree_.getChildren()[7].select();
		var newBlockSvg = Blockly.mainWorkspace.toolbox_.flyout_.placeNewBlock_(Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[2]);
		control.currentBlock = new Block(newBlockSvg, cursorPosition);
		control.closeFlyout()
		control.currentBlock.blockSvg.select();
		control.currentBlock.blockSvg.moveBy(200,10)
		control.blocks.push(control.currentBlock);
		control.currentBlock = null;
	}

	drawCircle = function(hand, frame){
		var c = document.getElementById("cursor-canvas");
		//var fingerOffset = [-140, 400];
		//var leapPoint = hand.fingers[1].screenPosition(); //could be any point
		var leapPoint = hand.fingers[1].tipPosition;
		var iBox = frame.interactionBox;
		var normalizedPoint = iBox.normalizePoint(leapPoint, true);
		
		//var appX = normalizedPoint[0] * .innerWidth;
		//var appY = (1 - normalizedPoint[1]) * window.innerHeight;
		var appX = normalizedPoint[0] * c.width
		var appY = (1 - normalizedPoint[1]) * c.height
		console.log(leapPoint);
		console.log(normalizedPoint);
		
		
		var ctx = c.getContext("2d");
		//ctx.clearRect(0, 0, c.width, c.height);
		
		document.getElementById('user-said').innerHTML = appX +" , "+appY;
		
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.arc(appX, appY, 4, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = "yellow";
		ctx.fill();

	}
	
	


	Leap.loop({enableGestures:true}, function(frame){
		 leapFrame = frame;
		if(Blockly.mainWorkspace != null && init){
			control.getBlocksPositionInFlyout();
			control.getRange();
			init=false;
		}
		
		hand = frame.hands[0];
		control.timestamp = frame["timestamp"];
		
		if(hand && Blockly.mainWorkspace != null){
			//draw 
			drawCircle(hand, frame);
			
			//console.log(hand.screenPosition())
			fingerCursorUpdate(hand);
		
			//console.log(cursorPosition);
			var extendedFingers = 0;
			for(var f = 0; f < hand.fingers.length; f++){
				var finger = hand.fingers[f];
				if(finger.extended) extendedFingers++;
			}
			//console.log(Math.round(hand.screenPosition()[0])+","+ Math.round(hand.screenPosition()[1]));
			//console.log(cursorPosition[0] +","+ cursorPosition[1]);
			var hoveringPlace = control.getHoveringPlace(cursorPosition);//hover:drawer or viewer
		
			//when one finger, hovering over a block 
			if(extendedFingers == 1){
				//1.If over drawer
				if(hoveringPlace == "drawer" && control.currentBlock==null){//should allow to open drawer even though selected 
					control.openClosestFlyout(cursorPosition);
					document.getElementById('user-said').innerHTML = "Select drawer";
				}else if(hoveringPlace == "viewer"){
					if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){	
				//2.Over flyout(and current block is null)
						if(checkInFlyout(cursorPosition) && control.currentBlock == null){
							//Is one block possible for move?
							if(BLOCK_SELECTED_FOR_MOVE == null){
								control.hoverOverFlyout(cursorPosition);
								document.getElementById('user-said').innerHTML = "Searching in flyout";
							}else{
								control.getBlockFromDrawer(cursorPosition);
								document.getElementById('user-said').innerHTML = "Selected from flyout";
								control.closeFlyout();
							}	
						}else{
							control.closeFlyout();
						}
					}else{
				//3.Over viewer(flyout closed)
						if(control.currentBlock== null){
							if(BLOCK_SELECTED_FOR_MOVE == null){
								//find the closest block and highlight it
								control.hoverOverViewer(cursorPosition);
								document.getElementById('user-said').innerHTML = "Searching in viewer";
							}else{
								document.getElementById('user-said').innerHTML = "Selected from viewer";
								control.getBlockFromViewer(cursorPosition);
							}
						}else{
							control.currentBlock.highlightClosestConnection();
							control.moveHoldingBlock(cursorPosition);
							document.getElementById('user-said').innerHTML = "Moving block";
						}
					}					
					
				}
					
			//when extend all fingers, 
			//put the block down
			//or do nothing
			}else if(extendedFingers > 4){
				
				if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible() == false){
					if(control.currentBlock!=null){ //let the block go
						control.highlightCon();
						control.stopMovingBlock();
					}
				}
			}
			
			
			
			
		}//hand
			
	}).use('screenPosition', {scale: 0.57});
	
	
	
	testProcessed = false;
	var processSpeech = function(transcript){
		testProcessed = false;
		var userSaid = function(str, commands){
			
			commands = commands.split(" ").filter(function(word) {
				return word.length > 0;
			});
			for (var i = 0; i < commands.length; i++) {
				if (str.indexOf(commands[i]) < 0)
					return false;
			}
			return true;
		};
		var spokenSetVariableX = false;
		var spokenGetVariableX = false;
		var candidateSet = ["set variable x","set variable X", "set durable x","set variable X","set the x","set the X", "set bearable X", "set bearable x"]
		var candidateGet = ["variable x","variable X","X", "x","get variable x","get variable X", "get durable x","get durable X", 
							"durable X", "durable x", "bearable x", "bearable X", "jet bearable X", "get X", "get x", "get verbal X", "get verbal x"]
		candidateSet.forEach(function(candidate){
			if(userSaid(transcript, candidate)){
				spokenSetVariableX = true
			}
		})
		
		candidateGet.forEach(function(candidate){
			if(userSaid(transcript, candidate)){
				spokenGetVariableX = true
			}
		})
		
		if(spokenSetVariableX){
			setVariable();
			getVariable();
			testProcessed = true;
		}
		if(spokenGetVariableX){
			getVariable();
			testProcessed = true;
			
		}

		//console.log("processed: "+testProcessed);
		
		return testProcessed
		
	}
	