
	var hand = null;
	var cursorPosition = [0, 0];
	var control = new Control();
	var offset = [-250, 400]
	var choseBlock = false;
	var choseDrawer = false;
	
	cursorPositionUpdate = function(hand){
		cursorPosition[0] = hand.screenPosition()[0]+offset[0];
		cursorPosition[1] = hand.screenPosition()[1]+offset[1];//offset
		//console.log(cursorPosition[0] +" , "+cursorPosition[1]);
	}
	
	checkInFlyout = function(cursorPosition){
		if(cursorPosition[0]<FLYOUT_BOUNDARY){
						return true;
		}
		return false;
	}

	Leap.loop({enableGestures:true}, function(frame){
		hand = frame.hands[0];
		if(hand){
			cursorPositionUpdate(hand);
			
			var hoveringPlace = control.getHoveringPlace(cursorPosition);//hover:drawer or viewer
			
			if(hand.pinchStrength < 0.9){
				if(hoveringPlace == "drawer"){
					if(!choseBlock){
						choseDrawer = true;
						control.openClosestFlyout(cursorPosition);//open flyout
					}
					
				}else{//hoveringPlace == "viewer"
					if(!checkInFlyout(cursorPosition)){
						control.closeFlyout();
					}
					if(choseBlock){ //let the block go
						choseBlock = false;
					}
				}
					
				
			}else{ //hand is grabbing for something
				if(hoveringPlace == "viewer"){
					if(!choseBlock && choseDrawer && checkInFlyout(cursorPosition)){ //need this for preventing double choosing
						choseBlock = true;
						console.log("placed");
						control.getBlockFromDrawer(cursorPosition);
						choseDrawer = false; //closed drawer
					}else if(choseBlock && !choseDrawer){//holding block. should move it around
						control.moveHoldingBlock(cursorPosition);
					}
			
				}
			}
		}//hand
			
	}).use('screenPosition', {scale: 0.6});