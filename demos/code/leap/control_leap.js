	
	var hand;
	var cursorPosition = [0, 0, 0];
	var control = new Control();
	var windowSize = [window.innerWidth,window.innerHeight];
	var leapFrame;
	var leapController; 
	var testProcessed = false;
	var spokenMove = false;
	var spoken = true;
	
	fingerCursorUpdate = function(hand, frame){
		var leapPoint = hand.fingers[1].tipPosition;
		var iBox = frame.interactionBox;
		var normalizedPoint = iBox.normalizePoint(leapPoint, true);
		
		var appX = normalizedPoint[0] * windowSize[0]
		var appY = (1 - normalizedPoint[1]) * windowSize[1]
		cursorPosition[0] = appX;
		cursorPosition[1] = appY;
	}
	
	checkInFlyout = function(cursorPosition){
		var DRAWER_BOUNDARY = document.getElementsByClassName('blocklyToolboxDiv')[0].offsetWidth;
		//if(DRAWER_BOUNDARY - 20 <cursorPosition[0] && cursorPosition[0] < Blockly.mainWorkspace.toolbox_.flyout_.width_+200){
		if(DRAWER_BOUNDARY - 20 <cursorPosition[0] && cursorPosition[0] < 550){
			console.log("flyout");
			console.log(cursorPosition[0]);
			return true;
		}
		console.log("viewr");
		console.log(cursorPosition[0]);
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
	
	resizeForCursor = function() {
		var c = document.getElementById("abs_mapping_stage");
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }

	
	mapCursor = function(){
		var abs = {};
		abs.width = window.innerWidth;
		abs.height = window.innerHeight;
		abs.stage = new Kinetic.Stage({
				container: 'abs_mapping_stage',
				width: abs.width,
				height: abs.height
		});

		abs.layer = new Kinetic.Layer();

		
		abs.tip = new Kinetic.Circle({
				x: 239,
				y: 75,
				radius: 10,
				fill: 'green',
				stroke: 'black',
				strokeWidth: 3.5,
				opacity:.5,
				visible: true
			  });

		abs.layer.add(abs.tip);
		abs.stage.add(abs.layer);
		
		

		abs.scale = 600/470;
		abs.anim = new Kinetic.Animation(function(frame) {
			var leap_frame = leapController.frame(); //leap is a connected leapController object
			if(leap_frame.valid && leap_frame.pointables.length > 0){
			   //pointable = leap_frame.pointables[0];
			   //abs.tip.x(pointable.tipPosition[0] * abs.scale + abs.width/2);
			   //abs.tip.y(abs.height - pointable.tipPosition[1] * abs.scale);
				var hand = leap_frame.hands[0];
				var leapPoint = hand.fingers[1].tipPosition;
				var iBox = leap_frame.interactionBox;
				var normalizedPoint = iBox.normalizePoint(leapPoint, true);
				
				//var appX = normalizedPoint[0] * .innerWidth;
				//var appY = (1 - normalizedPoint[1]) * window.innerHeight;
				var appX = normalizedPoint[0] * windowSize[0]
				var appY = (1 - normalizedPoint[1]) * windowSize[1]
			   
			   abs.tip.x(appX);
			   abs.tip.y(appY);
			} else if (abs.tip.y() < 0){
			   abs.tip.x(abs.width/2);
			   abs.tip.y(abs.height/2);     
			}

		}, abs.layer);

		abs.anim.start();
		
	}
	

	leapController = Leap.loop({enableGestures:true}, function(frame){
		leapFrame = frame;
		hand = frame.hands[0];
		control.timestamp = frame["timestamp"];
		
		if(init){
			if(Blockly.mainWorkspace != null && control != null){
				control.getBlocksPositionInFlyout();
				control.getRange();
				init= false;
			}	
			Blockly.mainWorkspace.variableList = [];
			
		}
		
		if(hand && Blockly.mainWorkspace != null){
			//draw 
			resizeForCursor()

			fingerCursorUpdate(hand, frame);
			
			
			var extendedFingers = 0;
			for(var f = 0; f < hand.fingers.length; f++){
				var finger = hand.fingers[f];
				if(finger.extended) extendedFingers++;
			}

			var hoveringPlace = control.getHoveringPlace(cursorPosition);//hover:drawer or viewer
		
			//when one finger, hovering over a block 
			if(extendedFingers == 1){
				//1.If over drawer
				if(hoveringPlace == "drawer" && control.currentBlock==null){//should allow to open drawer even though selected 
					document.getElementById('feedback').innerHTML = 'Waiting for a new block';
					control.openClosestFlyout(cursorPosition);
					
				}else if(hoveringPlace == "viewer"){
					if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){	
				//2.Over flyout(and current block is null)
						if(checkInFlyout(cursorPosition) && control.currentBlock == null){
							//Is one block possible for move?
							if(BLOCK_SELECTED_FOR_MOVE == null){
								control.hoverOverFlyout(cursorPosition);
								//document.getElementById('feedback').innerHTML = "Use speech to move block after choosing.";
								
							}else{
								if(spoken){
									control.getBlockFromDrawer(cursorPosition);
									document.getElementById('feedback').innerHTML = "Moving :)";
									control.closeFlyout();
									console.log("closed 1");
								}else{
									if(BLOCK_SELECTED_FOR_MOVE.svgGroup_ != null){
										console.log(BLOCK_SELECTED_FOR_MOVE);
										BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove();
									}
									
								}
							}	
						}else{
							control.closeFlyout();
							console.log("closed 2");
						}
					}else{
				//3.Over viewer(flyout closed)
						if(control.currentBlock== null){
							if(BLOCK_SELECTED_FOR_MOVE == null){
								//find the closest block and highlight it
								control.hoverOverViewer(cursorPosition);
								//document.getElementById('feedback').innerHTML = "Use speech to move block after choosing.";
							}else{
								
								if(spoken){
									document.getElementById('feedback').innerHTML = "Moving :)";
									control.getBlockFromViewer(cursorPosition);
								}else{
									if(BLOCK_SELECTED_FOR_MOVE != null){
										BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove();
									}
								}
								
							}
						}else{
							control.currentBlock.highlightClosestConnection();
							control.moveHoldingBlock(cursorPosition);
							document.getElementById('feedback').innerHTML = "Moving :)";
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
					if(BLOCK_SELECTED_FOR_MOVE != null){
						BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove();
						
					}
					document.getElementById('feedback').innerHTML = "Waiting for a new block.";
				}
			}

		}//hand
			
	}).use('screenPosition', {scale: 0.57});
	
	

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
		spokenMove = false;
		var candidateSet = ["variable i", "Variable I", "variable I", "bearable i", "bearable I", "set variable I'm", "set variable i'm", "set terrible I'm", "set terrible i'm", "set variable i","set variable I","set variable x","set variable X", "set durable x","set variable X","set the x","set the X", "set bearable X", "set bearable x"]
		var candidateGet = []
		var candidateMove = ['move', 'Move', 'Mo', 'Go', 'go', 'start', 'Start', 'star', 'Star','choose','Choose', 'Chose','chose'];
		
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
		
		candidateMove.forEach(function(candidate){
			if(userSaid(transcript, candidate)){
				spokenMove = true
			}
		})
		
		if(spokenMove){
			control.saidMove = true;
		}
		
		
		if(spokenSetVariableX){
			setVariable();
			getVariable();
			testProcessed = true;
		}
		if(spokenGetVariableX){
			getVariable();
			testProcessed = true;
			
		}

	
		return testProcessed
		
	}
	