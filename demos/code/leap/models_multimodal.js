
	var FLYOUT_BOUNDARY = 382;
	var DRAWER_BOUNDARY = -20;
	var CATEGORY_STARTING_POINT = 0;//26.55;
	var CATEGORY_SECTION_HEIGHT = 57; //26.55;
	var BLOCK_CATEGORIES = ["Logic", "Loops", "Math", "Text", "Lists", "Colour", "Variables", "Functions"];
	var category_index = -1;
	var FLYOUT_BLOCKS_POSITION = {"Logic":[], "Loops":[], "Math":[], "Text":[], "Lists":[], "Colour":[], "Variables":[], "Functions":[]};
	var FLYOUT_RANGE = {"Logic":[], "Loops":[], "Math":[], "Text":[], "Lists":[], "Colour":[], "Variables":[], "Functions":[]};
	
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
		this.chosenConnection = null;
		this.workSpace = Blockly.mainWorkspace;
	}
	

	Control.prototype.getHoveringPlace = function(cursorPosition){
		var currentX = cursorPosition[0];
		if(currentX < DRAWER_BOUNDARY){
			return "drawer";
		}
		return "viewer";
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
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*6<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*7){
			category_index = 6;
		}else if(CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*7<currentY && currentY <= CATEGORY_STARTING_POINT+CATEGORY_SECTION_HEIGHT*8){
			category_index = 7;
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
		console.log("hovering over viewer");
		if(!Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){//flyout should be closed
			this.blocks.forEach(function(block){
				var blockX = block.blockSvg.getRelativeToSurfaceXY()['x'];
				var blockY = block.blockSvg.getRelativeToSurfaceXY()['y'];
				var deltaX = cursorPosition[0] - blockX;
				var deltaY = cursorPosition[1] - blockY;
				var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
				console.log(distance);
				if(distance < shortestDistance){
					closestBlock = block;
					shortestDistance = distance;
				}
				
			});
			if(closestBlock!=null){
				console.log("selected");
				console.log(closestBlock);
				this.candidateBlock = closestBlock;
				closestBlock.blockSvg.select();
			}
		}
		
	}

	Control.prototype.hoverOverFlyout = function(cursorPosition){
		this.candidateBlock = null;
		if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){
			var blocksBoundary = FLYOUT_RANGE[control.chosenDrawer];
			for(var i=0 ; i<(blocksBoundary.length-1); i++){
				var currentY = cursorPosition[1];
				if(blocksBoundary[i] < currentY && currentY < blocksBoundary[i+1]){
					this.candidateBlock = Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[i];
					this.candidateBlock.select();
					
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
		}
		
	}
	
	Control.prototype.moveHoldingBlock = function(cursorPosition){
		this.currentBlock.move(cursorPosition);
	}
	
	Control.prototype.stopMovingBlock = function(){	
		//console.log(this.currentBlock.blockSvg);
		this.currentBlock.stopMove();
		this.currentBlock = null;
		this.chosenConnection = null;
		Blockly.selected.unselect();
	}

	Control.prototype.listenForConnection = function(){
		
		var candidate = this.currentBlock.getClosestConnection();
		//console.log(candidate);
		if(candidate != null){
			candidate[0].connect(candidate[1]);
		}
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
	
	Block.prototype.getClosestConnection = function(){
		var pairConnections = [];
		var blockSvg = this.blockSvg;
		this.connections.forEach(function(connection){
			if(blockSvg.dragStartXY_ != null){
				var position = blockSvg.getRelativeToSurfaceXY();
				var offset = goog.math.Coordinate.difference(position, blockSvg.dragStartXY_);
				var result = connection.dbOpposite_.searchForClosest(connection, 20, offset);
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
		
		// console.log("drag start");
		// console.log(this.blockSvg.dragStartXY_);
		// console.log(this.blockSvg.getRelativeToSurfaceXY());
		//console.log(deltaX +","+deltaY);
		//console.log((afterRelativeX - beforeRelativeX) + "," +(afterRelativeY - beforeRelativeY));
	}

	Block.prototype.highlight = function(){
		this.blockSvg.select();
	}

	Block.prototype.unhighlight = function(){
		
	}

