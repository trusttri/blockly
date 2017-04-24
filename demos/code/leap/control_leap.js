	
	var hand = null;
	var cursorPosition = [0, 0];
	var control = new Control();
	var offset = [-280, 280]
	var init = true;
	cursorPositionUpdate = function(hand){
		cursorPosition[0] = hand.screenPosition()[0]+offset[0];
		cursorPosition[1] = hand.screenPosition()[1]+offset[1];
	}
	
	checkInFlyout = function(cursorPosition){
		if(cursorPosition[0]<Blockly.mainWorkspace.toolbox_.flyout_.width_+5){
						return true;
		}
		return false;
	}

	Leap.loop({enableGestures:true}, function(frame){
		if(Blockly.mainWorkspace != null && init){
			control.getBlocksPositionInFlyout();
			control.getRange();
			init=false;
		}
		
		hand = frame.hands[0];
		if(hand && Blockly.mainWorkspace != null){
			cursorPositionUpdate(hand);
			console.log(cursorPosition);
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