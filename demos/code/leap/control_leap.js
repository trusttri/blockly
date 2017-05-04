	
	var hand = null;
	var cursorPosition = [0, 0, 0];
	var control = new Control();
	var offset = [-280, 280]
	var init = true;
	hand =""
	cursorPositionUpdate = function(hand){
		cursorPosition[0] = hand.screenPosition()[0]+offset[0];
		cursorPosition[1] = hand.screenPosition()[1]+offset[1];
		cursorPosition[2] = hand.screenPosition()[2]
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
	
	var commands = {
			'set(variable i)' : function() {
				setVariable()
			},
			
			"set durable I": function() {
				setVariable()
			},
			
			" variable I": function() {
				setVariable()
			}, " Sudbury belie": function() {
				setVariable()
			}, " set variable eye": function() {
				setVariable()
			}, " said bearable I": function() {
				setVariable()
			},
			"get variable":function(){
				getVariable()
			}, " get verbal":function(){
				getVariable()
			}, " getable":function(){
				getVariable()
			}, 
			"get (variable I)":function(){
				getVariable()
			}, "get bearable I":function(){
				getVariable()
			}, "get variable on":function(){
				getVariable()
			}, "get bearable":function(){
				getVariable()
			},
			'get variable (i)':function(){
				getVariable()
			},
			
		};
	
	if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
		

		// Add our commands to annyang
		annyang.addCommands(commands);
		annyang.addCallback('resultMatch', function(userSaid, commandText, phrases) {
		  console.log(userSaid); // sample output: 'hello'
		  console.log(commandText); // sample output: 'hello (there)'
		  console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
		});

		// Start listening. You can call this here, or attach this call to an event, button, etc.
		annyang.start();
	}

	Leap.loop({enableGestures:true}, function(frame){
		 
		if(Blockly.mainWorkspace != null && init){
			control.getBlocksPositionInFlyout();
			control.getRange();
			init=false;
		}
		
		hand = frame.hands[0];
		
		if(hand && Blockly.mainWorkspace != null){
			console.log(hand.screenPosition())
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