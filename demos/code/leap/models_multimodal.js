
	var FLYOUT_BOUNDARY = 382;
	var DRAWER_BOUNDARY = -20;
	var CATEGORY_STARTING_POINT = 0;//26.55;
	var CATEGORY_SECTION_HEIGHT = 57; //26.55;
	var BLOCK_CATEGORIES = ["Logic", "Loops", "Math", "Text", "Lists", "Colour", "","Variables", "Functions"];
	var category_index = -1;
	var FLYOUT_BLOCKS_POSITION = {"Logic":[], "Loops":[], "Math":[], "Text":[], "Lists":[], "Colour":[], "Variables":[], "Functions":[]};
	var FLYOUT_RANGE = {"Logic":[], "Loops":[], "Math":[], "Text":[], "Lists":[], "Colour":[], "Variables":[], "Functions":[]};
	var BLOCK_SELECTED_FOR_MOVE;
	// Blockly.INPUT_VALUE = 1;
	// Blockly.OUTPUT_VALUE = 2;
	// Blockly.NEXT_STATEMENT = 3;
	// Blockly.PREVIOUS_STATEMENT = 4;
	// Blockly.DUMMY_INPUT = 5;
		
	Control = function(){
	
		this.flyoutOpen = false;
		this.chosenDrawer = "";
		this.blocks = [];
		this.currentBlock = null;
		this.candidateBlock = null;
		this.candidateConnection = null;
		this.workSpace = Blockly.mainWorkspace;
	}
	

	Control.prototype.getHoveringPlace = function(cursorPosition){
		var currentX = cursorPosition[0];
		if(currentX < DRAWER_BOUNDARY){
			return "drawer";
		}
		return "viewer";
	}
	
	Control.prototype.createVariable = function(variableName){
		Blockly.mainWorkspace.toolbox_.tree_.getChildren()[7].select();
		Blockly.mainWorkspace.createVariable(variableName)
	}


	Control.prototype.openClosestFlyout = function(cursorPosition){
		//Control, Logic, Math, Text, Lists, Colors, Variables, Procedures
		var currentY = cursorPosition[1];
		if(CATEGORY_STARTING_POINT<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT){
			category_index = 0;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*2){
			category_index = 1;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*2<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*3){
			category_index = 2;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*3<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*4){
			category_index = 3;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*4<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*5){
			category_index = 4;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*5<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*6){
			category_index = 5;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*6<currentY){
			category_index = 7;
		// }else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*7<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*8){
			// category_index = 6;
		}
		if(category_index != -1){
			control.chosenDrawer = BLOCK_CATEGORIES[category_index];
			Blockly.mainWorkspace.toolbox_.tree_.getChildren()[category_index].select();
			
		}

	}

	Control.prototype.closeFlyout = function(){
		this.chosenDrawer = "";
		this.flyoutOpen  = false;
		Blockly.mainWorkspace.toolbox_.flyout_.hide();
		
	}

	Control.prototype.hoverOverViewer = function(cursorPosition){
		this.candidateBlock = null;
		var shortestDistance = 1000;
		var closestBlock = null;
		if(BLOCK_SELECTED_FOR_MOVE!=null && cursorPosition[2] > 37){
			BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove()
			
		}
		if(!Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){//flyout should be closed
			this.blocks.forEach(function(block){
				var blockX = block.blockSvg.getRelativeToSurfaceXY()['x'];
				var blockY = block.blockSvg.getRelativeToSurfaceXY()['y'];
				var deltaX = cursorPosition[0] - blockX;
				var deltaY = cursorPosition[1] - blockY;
				var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
				if(distance < shortestDistance){
					closestBlock = block;
					shortestDistance = distance;
					
				}
				
			});
			if(closestBlock!=null){
				this.candidateBlock = closestBlock;
				closestBlock.blockSvg.select();
				if(cursorPosition[2] < 37){
					console.log("close");
					closestBlock.blockSvg.selectForMove();
				}
			}
		}
		
	}

	Control.prototype.hoverOverFlyout = function(cursorPosition){
		this.candidateBlock = null;
		if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){
			
			if(BLOCK_SELECTED_FOR_MOVE!=null && cursorPosition[2] > 37){
				BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove()
			
			}
			
	
			var blocksBoundary = FLYOUT_RANGE[control.chosenDrawer];
		
			for(var i=0 ; i<(blocksBoundary.length-1); i++){
				var currentY = cursorPosition[1];
				if(blocksBoundary[i] < currentY && currentY < blocksBoundary[i+1]){
				
					this.candidateBlock = Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[i];
					this.candidateBlock.select();
					if(cursorPosition[2] < 37){
						
						//this.candidateBlock.selectForMove();
					}
					
					break;
				}			
			}
		}
		

	}

	Control.prototype.getBlockFromViewer = function(cursorPosition){
		var shortestDistance = 200;
		var optimalBlock = null;
		// this.blocks.forEach(function(block){
			// var deltaX = cursorPosition[0] - block.cursorX;
			// var deltaY = cursorPosition[1] - block.cursorY;
			// var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			// if(distance < shortestDistance){
				// optimalBlock = block;
				// shortestDistance = distance;
			// }
		// });
		
		if(this.candidateBlock !=null){
			this.currentBlock = this.candidateBlock;
			this.currentBlock.highlight();
			this.candidateBlock = null;
		}
		
	}

	
	Control.prototype.getBlockFromDrawer = function(cursorPosition){
		if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible() && Blockly.selected != null){
			var blockElement = Blockly.mainWorkspace.toolbox_.tree_.getChildren()[0].blocks[0];
			var newBlockSvg = Blockly.mainWorkspace.toolbox_.flyout_.placeNewBlock_(Blockly.selected);
			this.currentBlock = new Block(newBlockSvg, cursorPosition);
			//console.log(newBlockSvg);
			this.currentBlock.highlight();
			this.blocks.push(this.currentBlock);
			this.closeFlyout();
			this.candidateBlock = null;
			this.currentBlock.blockSvg.selectForMove()
		}
		
	}
	
	Control.prototype.moveHoldingBlock = function(cursorPosition){
		
		// if(BLOCK_SELECTED_FOR_MOVE!=null && cursorPosition[2] > 37){
			// BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove()
			// BLOCK_SELECTED_FOR_MOVE = null;
		// }else if(BLOCK_SELECTED_FOR_MOVE!= this.currentBlock.blockSvg && cursorPosition[2] <37){
			// BLOCK_SELECTED_FOR_MOVE = this.currentBlock.blockSvg;
			// BLOCK_SELECTED_FOR_MOVE.selectForMove();
		// }
		
		if(BLOCK_SELECTED_FOR_MOVE== this.currentBlock.blockSvg){
			this.currentBlock.move(cursorPosition);
		}
	}
	
	Control.prototype.stopMovingBlock = function(){	
		//console.log(this.currentBlock.blockSvg);
		this.currentBlock.stopMove();
		this.currentBlock = null;
		this.candidateConnection = null;
		if(Blockly.selected){
			Blockly.selected.unselect();
		}
		
	}

	Control.prototype.listenForConnection = function(){
		
		var candidate = this.currentBlock.getClosestConnection();
		//console.log(candidate);
		if(candidate != null){
			candidate[0].connect(candidate[1]);
		}
	}
	
	Control.prototype.getVariableBlocksPosition = function(){
		
		var blockElements = Blockly.mainWorkspace.toolbox_.flyout_.newCreatedBlocks;
		blockElements.forEach(function(blockElement){
				var blockSvg = Blockly.Xml.domToBlock(Blockly.mainWorkspace, blockElement);
				var height = blockSvg.height;
				blockSvg.dispose();
				FLYOUT_BLOCKS_POSITION["Variables"].push(height);
		});
		var precedingBound = 0;
		var positions = FLYOUT_BLOCKS_POSITION["Variables"];
		FLYOUT_RANGE["Variables"].push(-50);
		positions.forEach(function(blockLength){
			var thisBound = 8*2+blockLength+precedingBound
			FLYOUT_RANGE["Variables"].push(thisBound);
			precedingBound = thisBound;
		});
	}
	
	Control.prototype.getBlocksPositionInFlyout = function(){
		var flyouts = Blockly.mainWorkspace.toolbox_.tree_.getChildren()
		for(var i=0 ; i<6 ; i++){
			var blockElements = flyouts[i].blocks;
			blockElements.forEach(function(blockElement){
				var blockSvg = Blockly.Xml.domToBlock(Blockly.mainWorkspace, blockElement);
				var height = blockSvg.height;
				blockSvg.dispose();
				FLYOUT_BLOCKS_POSITION[BLOCK_CATEGORIES[i]].push(height);
			});
		}		
	}
	
	Control.prototype.getRange = function(){
		
		for(var i=0 ; i<6 ; i++){
			var precedingBound = 0;
			var positions = FLYOUT_BLOCKS_POSITION[BLOCK_CATEGORIES[i]];
			FLYOUT_RANGE[BLOCK_CATEGORIES[i]].push(-50);
			positions.forEach(function(blockLength){
				var thisBound = 8*2+blockLength+precedingBound
				FLYOUT_RANGE[BLOCK_CATEGORIES[i]].push(thisBound);
				precedingBound = thisBound;
			});
			
		}
		
	}
	

	Control.prototype.deleteAll = function(){
		this.blocks.forEach(function(block){
			block.blockSvg.dispose(false, true);
			
		});
		this.blocks = [];
		
	}

	Block = function(blockSvg, cursorPosition){
		this.blockSvg = blockSvg;
		this.workSpace = blockSvg.workSpace;
		this.connections = blockSvg.getConnections_(false);
		this.cursorX = cursorPosition[0];
		this.cursorY = cursorPosition[1];
		this.dragStart = true;
		
	}
	// Blockly.RenderedConnection.prototype.closest = function(maxLimit, dx, dy) {
		// return this.dbOpposite_.searchForClosest(this, maxLimit, dx, dy);
	// };
	
	Blockly.RenderedConnection.prototype.closestSecond = function(maxLimit, dx, dy) {
	  return this.dbOpposite_.searchForClosestSecond(this, maxLimit, dx, dy);
	};
		
		
	Blockly.ConnectionDB.prototype.isInYRangeSecond_ = function(index, baseY, maxRadius) {
		// console.log("is y range");
		// console.log(Math.abs(this[index].y_ - baseY));
	  return (Math.abs(this[index].y_ - baseY) <= maxRadius);
	};
	
	Blockly.ConnectionDB.prototype.searchForClosestSecond = function(conn, maxRadius, dxy) {
	  // Don't bother.
	  if (!this.length) {
		return {connection: null, radius: maxRadius};
	  }

	    // Stash the values of x and y from before the drag.
  var baseY = conn.y_;
  var baseX = conn.x_;
  //for some reason, shouldn't update here 
  // conn.x_ = baseX + dxy.x;
  // conn.y_ = baseY + dxy.y;
	 
	  // findPositionForConnection finds an index for insertion, which is always
	  // after any block with the same y index.  We want to search both forward
	  // and back, so search on both sides of the index.
	  var closestIndex = this.findPositionForConnection_(conn);

	  var bestConnection = null;
	  var bestRadius = maxRadius;
	  var temp;

	  // Walk forward and back on the y axis looking for the closest x,y point.
	  var pointerMin = closestIndex - 1;
	  while (pointerMin >= 0 && this.isInYRangeSecond_(pointerMin, conn.y_, maxRadius)) {
		temp = this[pointerMin];
		//console.log("search for second");
		if (conn.isConnectionAllowedSecond(temp, bestRadius)) {
		  bestConnection = temp;
		  bestRadius = temp.distanceFromSecond(conn);
		}
		pointerMin--;
	  }
	  var pointerMax = closestIndex;
	  while (pointerMax < this.length && this.isInYRange_(pointerMax, conn.y_,
		  maxRadius)) {
		temp = this[pointerMax];
		if (conn.isConnectionAllowed(temp, bestRadius)) {
		  bestConnection = temp;
		  bestRadius = temp.distanceFrom(conn);
		}
		pointerMax++;
	  }

	  // Reset the values of x and y.
	  conn.x_ = baseX;
	  conn.y_ = baseY;

	  // If there were no valid connections, bestConnection will be null.
	  return {connection: bestConnection, radius: bestRadius};
	};
	
	Blockly.RenderedConnection.prototype.distanceFromSecond = function(otherConnection) {
	  var xDiff = this.x_ - otherConnection.x_;
	  var yDiff = this.y_ - otherConnection.y_;
	  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
	};
	
	Blockly.RenderedConnection.prototype.isConnectionAllowedSecond = function(candidate,maxRadius) {
		// console.log("distance");
		// console.log(this.distanceFromSecond(candidate) );
	  if (this.distanceFromSecond(candidate) > maxRadius) {
		return false;
	  }

	  return Blockly.RenderedConnection.superClass_.isConnectionAllowed.call(this,
		  candidate);
	};
	
	Control.prototype.highlightCon = function(){
		
		//Blockly.selected && Blockly.highlightedConnection_ && a != Blockly.DELETE_AREA_TOOLBOX ? (Blockly.localConnection_.connect(Blockly.highlightedConnection_),
		if(this.currentBlock.blockSvg!=null && Blockly.highlightedConnection_!=null){
			Blockly.localConnection_.connect(Blockly.highlightedConnection_);
			if(Blockly.localConnection_.isSuperior()){
				Blockly.highlightedConnection_.getSourceBlock().connectionUiEffect();
			}else{
				Blockly.localConnection_.getSourceBlock().connectionUiEffect();
			}
		}
		if(Blockly.highlightedConnection_ !=null){
			Blockly.highlightedConnection_.unhighlight(); 
			Blockly.highlightedConnection_ = null;
		}
		
	}

	
	Block.prototype.highlightClosestConnection = function(){
		var blockSvg = this.blockSvg;
		// Check to see if any of this block's connections are within range of
			if(blockSvg.dragStartXY_ != null){
				var dxy = goog.math.Coordinate.difference(blockSvg.getRelativeToSurfaceXY(), blockSvg.dragStartXY_);//dxy  = offset
				// console.log("dxy");
				// console.log(dxy);
				
				//from blockly code. modified
				//another block's connection.
				var myConnections = blockSvg.getConnections_(false);
				// Also check the last connection on this stack
				var lastOnStack = blockSvg.lastConnectionInStack_();
				if (lastOnStack && lastOnStack != blockSvg.nextConnection) {
				  myConnections.push(lastOnStack);
				}
				var closestConnection = null;
				var localConnection = null;
				//var radiusConnection = Blockly.SNAP_RADIUS;
				var radiusConnection = 50;
				for (var i = 0; i < myConnections.length; i++) {
				  var myConnection = myConnections[i];
			
				  var neighbour = myConnection.closestSecond(radiusConnection, dxy);
				  //console.log(neighbour);
				  if (neighbour!=null && neighbour.connection) {
					//console.log("chosen");
					closestConnection = neighbour.connection;
					localConnection = myConnection;
					radiusConnection = neighbour.radius;
					//console.log(closestConnection);
				  }
				}

				// Remove connection highlighting if needed.
				if (Blockly.highlightedConnection_ &&
					  Blockly.highlightedConnection_ != closestConnection) {
					  Blockly.highlightedConnection_.unhighlight();
					  Blockly.highlightedConnection_ = null;
					  Blockly.localConnection_ = null;
				}

				//var wouldDeleteBlock = blockSvg.updateCursor_(e, closestConnection);

				// Add connection highlighting if needed.
				//if (!wouldDeleteBlock && closestConnection &&
				if (closestConnection &&
					closestConnection != Blockly.highlightedConnection_) {
					closestConnection.highlight();
					console.log("hihghliht");
					Blockly.highlightedConnection_ = closestConnection;
					Blockly.localConnection_ = localConnection;
					console.log(Blockly.highlightedConnection_.targetBlock());
				}
	
			}
			
		//console.log(Blockly.highlightedConnection_);
  
	}
	
	Block.prototype.getClosestConnection = function(){
		var pairConnections = [];
		var blockSvg = this.blockSvg;
		this.connections.forEach(function(connection){
			if(blockSvg.dragStartXY_ != null){
				var position = blockSvg.getRelativeToSurfaceXY();
				var offset = goog.math.Coordinate.difference(position, blockSvg.dragStartXY_);
				var result = connection.dbOpposite_.searchForClosest(connection, 100, offset);
				pairConnections.push([connection, result.connection, result.radius]);
			}
			
		});
		
		var shortestDistance = 20;
		var optimalConnection = null;
		pairConnections.forEach(function(pair){
			var distance = pair[2];
			if(distance < shortestDistance){
				optimalConnection = [pair[0], pair[1]];
				shortestDistance = distance;
			}
			
		});

		return optimalConnection;
	}
	
	Block.prototype.stopMove = function(){
		this.dragStart = true;
	}


	Block.prototype.move = function(cursorPosition){
		if(this.dragStart){
			this.blockSvg.dragStartXY_ = this.blockSvg.getRelativeToSurfaceXY();
			// console.log("started moving");
			// console.log(this.blockSvg.dragStartXY_);
			// console.log(this.blockSvg.getConnections_(false)[0].x_ +","+this.blockSvg.getConnections_(false)[0].y_ );
			this.dragStart = false;
		}
		var beforeRelativeX = this.blockSvg.getRelativeToSurfaceXY()['x'];
		var beforeRelativeY = this.blockSvg.getRelativeToSurfaceXY()['y'];
		
		var deltaX = cursorPosition[0] - beforeRelativeX; //before it was this.cursorX
		var deltaY = cursorPosition[1] - beforeRelativeY;
		//update new X, Y
		this.cursorX += deltaX;
		this.cursorY += deltaY;
		this.blockSvg.moveBy(deltaX, deltaY);
		
		var afterRelativeX = this.blockSvg.getRelativeToSurfaceXY()['x'];
		var afterRelativeY = this.blockSvg.getRelativeToSurfaceXY()['y'];
		
		//check for disconnect
		this.blockSvg.unplug();
		
		// console.log("drag start");
		// console.log(this.blockSvg.dragStartXY_);
		// console.log(this.blockSvg.getRelativeToSurfaceXY());
		//console.log(deltaX +","+deltaY);
		//console.log((afterRelativeX - beforeRelativeX) + "," +(afterRelativeY - beforeRelativeY));
		//console.log("after move");
		//console.log(this.blockSvg.getConnections_(false)[0].x_ +","+this.blockSvg.getConnections_(false)[0].y_ );
	}

	Block.prototype.highlight = function(){
		this.blockSvg.select();
	}

	Block.prototype.unhighlight = function(){
		
	}

	Blockly.BlockSvg.prototype.addSelectForMove = function() {
		Blockly.utils.addClass(this.svgGroup_, "blocklyLeapSelected");
		var a = this;
		do {
			var b = a.getSvgRoot();
			b.parentNode.appendChild(b);
			a = a.getParent()
		} while (a)
	};

	Blockly.BlockSvg.prototype.removeSelectForMove = function() {
		Blockly.utils.removeClass(this.svgGroup_, "blocklyLeapSelected")
	};
	
	
	Blockly.BlockSvg.prototype.selectForMove = function() {
	  if (this.isShadow() && this.getParent()) {
		// Shadow blocks should not be selected.
		this.getParent().selectForMove();
		return;
	  }
	  if (BLOCK_SELECTED_FOR_MOVE == this) {
		return;
	  }
	  var oldId = null;
	  if (BLOCK_SELECTED_FOR_MOVE) {
		oldId = BLOCK_SELECTED_FOR_MOVE.id;
		// Unselect any previously selected block.
		Blockly.Events.disable();
		try {
		  BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove();
		} finally {
		  Blockly.Events.enable();
		}
	  }

	  BLOCK_SELECTED_FOR_MOVE = this;
	  this.addSelectForMove();
	};
	
	Blockly.BlockSvg.prototype.unselectForOtherMove = function() {
	  if (BLOCK_SELECTED_FOR_MOVE != this) {
		return;
	  }
	
	  BLOCK_SELECTED_FOR_MOVE = null;
	  this.removeSelectForMove();
	};
