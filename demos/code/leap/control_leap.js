	
	var hand = null;
	var cursorPosition = [0, 0, 0];
	var control = new Control();
	var offset = [-280, 280]
	var fingerOffset = [115, -165];
	var init = true;
	hand =""
	cursorPositionUpdate = function(hand){
		cursorPosition[0] = hand.screenPosition()[0]+offset[0];
		cursorPosition[1] = hand.screenPosition()[1]+offset[1];
		cursorPosition[2] = hand.screenPosition()[2]
	}
	cursorPositionUpdate2 = function(hand){
		finger = hand.fingers[1]["stabilizedTipPosition"];
		cursorPosition[0] = finger[0]+fingerOffset[0];
		cursorPosition[1] = finger[1]+fingerOffset[1];
		cursorPosition[2] = finger[2]
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
	
	


	Leap.loop({enableGestures:true}, function(frame){
		 
		if(Blockly.mainWorkspace != null && init){
			control.getBlocksPositionInFlyout();
			control.getRange();
			init=false;
		}
		
		hand = frame.hands[0];
		control.timestamp = frame["timestamp"];
		
		
		
		if(hand && Blockly.mainWorkspace != null){
			//console.log(hand.screenPosition())
			cursorPositionUpdate(hand);
			console.log(hand.fingers[1]["stabilizedTipPosition"]);
			console.log(cursorPosition);
			//console.log(cursorPosition);
			var extendedFingers = 0;
			for(var f = 0; f < hand.fingers.length; f++){
				var finger = hand.fingers[f];
				if(finger.extended) extendedFingers++;
			}
			//console.log(Math.round(hand.screenPosition()[0])+","+ Math.round(hand.screenPosition()[1]));
			//console.log(cursorPosition[0] +","+ cursorPosition[1]);
			var hoveringPlace = control.getHoveringPlace(cursorPosition);//hover:drawer or viewer
			
			if(extendedFingers == 5){
				if(hoveringPlace == "drawer" && control.currentBlock==null){//should allow to open drawer even though selected 
					control.openClosestFlyout(cursorPosition);
				}else if(hoveringPlace == "viewer"){
					if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){
						if(checkInFlyout(cursorPosition)){
							control.hoverOverFlyout(cursorPosition);
							
						}else{
							control.closeFlyout();
						}
					}else{
						if(control.currentBlock!=null){ //let the block go
							control.highlightCon();
							control.stopMovingBlock();
						}else{
							//find the closest block and highlight it
							control.hoverOverViewer(cursorPosition);
							
							
						}
					}					
					
				}
					
				
			}else if(extendedFingers <=1){ //hand is grabbing for something
				if(hoveringPlace == "viewer"){
					if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){//is flyout open?
						if(control.currentBlock == null && checkInFlyout(cursorPosition)){
							control.getBlockFromDrawer(cursorPosition);
							if(control.currentBlock != null){
								control.closeFlyout();
							}
							
						}
						
					}else{
						if(control.currentBlock != null){
							control.currentBlock.highlightClosestConnection();
							control.moveHoldingBlock(cursorPosition);
							
							//control.listenForConnection();
							
						}else{
							control.getBlockFromViewer(cursorPosition);
						}
						
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
	