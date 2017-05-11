	
	//variables for debugging;
	var hand;
	
	
	var cursorPosition = [0, 0, 0];
	var control = new Control();
	var offset = [-280, 280]
	var init = true;
	
	
	cursorPositionUpdate = function(hand){
		cursorPosition[0] = hand.screenPosition()[0]+offset[0];
		cursorPosition[1] = hand.screenPosition()[1]+offset[1];
		cursorPosition[2] = hand.screenPosition()[2]
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
	
	
	


	var leapController = Leap.loop({enableGestures:true}, function(frame){
		 
		if(Blockly.mainWorkspace != null && init){
			control.getBlocksPositionInFlyout();
			control.getRange();
			Blockly.mainWorkspace.variableList = [];
			init=false;
		}
		
		hand = frame.hands[0];
		
		if(hand && Blockly.mainWorkspace != null){
			//console.log(hand.screenPosition())
			cursorPositionUpdate(hand);
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
						if(control.checkInFlyout(cursorPosition)){
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
						if(control.currentBlock == null && control.checkInFlyout(cursorPosition)){
							control.getBlockFromDrawer(cursorPosition);
							control.closeFlyout();
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
		var candidateSet = ["bearable i", "Bearable I", "variable i", "variable I", "set variable I'm", "set variable i'm", "set terrible I'm", "set terrible i'm", "set variable i","set variable I","set variable x","set variable X", "set durable x","set variable X","set the x","set the X", "set bearable X", "set bearable x"]
		var candidateGet = []
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
	