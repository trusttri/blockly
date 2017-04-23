
	var FLYOUT_BOUNDARY = 382;
	var DRAWER_BOUNDARY = 0;
	var CATEGORY_STARTING_POINT = 0;//26.55;
	var CATEGORY_SECTION_HEIGHT = 22; //26.55;
	var BLOCK_CATEGORIES = ["Logic", "Loops", "Math", "Text", "Lists", "Colour", "Variables", "Functions"];
	var category_index = -1;
	
	
	Control = function(){
	
		this.flyoutOpen = false;
		this.chosenDrawer = "";
		this.blocks = [];
		this.currentBlock = null;
		this.chosenConnection = null;
		this.workSpace = Blockly.mainWorkspace;
	}
	

	Control.prototype.getHoveringPlace = function(cursorPosition){
		var currentX = cursorPosition[0];
		if(currentX < DRAWER_BOUNDARY){
			//console.log("in drawer");
			return "drawer";
		}
		//console.log("in viewer");
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

	Control.prototype.hoverOverDrawer = function(cursorPosition){
	}

	Control.prototype.hoverOverFlyout = function(cursorPosition){

	}

	Control.prototype.getBlockFromViewer = function(cursorPosition){
		var shortestDistance = 20;
		var optimalBlock = null;
		this.blocks.forEach(function(block){
			var deltaX = cursorPosition[0] - block.cursorX;
			var deltaY = cursorPosition[1] - block.cursorY;
			var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			if(distance < shortestDistance){
				optimalBlock = block;
				shortestDistance = distance;
			}
		});
		
		if(optimalBlock!=null){
			this.currentBlock = optimalBlock;
		}
		
	}
	
	Control.prototype.getBlockFromDrawer = function(cursorPosition){
		var blockElement = Blockly.mainWorkspace.toolbox_.tree_.getChildren()[0].blocks[0];
		this.currentBlock = new Block(Blockly.Xml.domToBlock(Blockly.mainWorkspace, blockElement), cursorPosition);
		this.currentBlock.highlight();
		this.blocks.push(this.currentBlock);
		this.closeFlyout();
	}
	
	Control.prototype.moveHoldingBlock = function(cursorPosition){
		this.currentBlock.move(cursorPosition);
	}

	Control.prototype.listenForConnection = function(){
		
		var candidate = this.currentBlock.getClosestConnection();
		if(candidate != null){
			candidate[0].connect(candidate[1]);
		}
	}


	Block = function(blockSvg, cursorPosition){
		this.blockSvg = blockSvg;
		this.workSpace = blockSvg.workSpace;
		this.connections = blockSvg.getConnections_(false);
		this.cursorX = cursorPosition[0];
		this.cursorY = cursorPosition[1];
		console.log("firstX"+","+this.cursorX+","+this.cursorY);
	}
	
	Block.prototype.getClosestConnection = function(){
		var pairConnections = [];
		this.connections.forEach(function(connection){
			var position = this.blockSvg.getRelativeToSurfaceXY();
			var offset = goog.math.Coordinate.difference(position, this.blockSvg.dragStartXY_);
			var result = connection.dbOpposite_.searchForClosest(connection, 20, offset);
			pairConnections.add([connection, result.connection, result.radius]);
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
		return [optimalConnection];
	}


	Block.prototype.move = function(cursorPosition){
		var deltaX = cursorPosition[0] - this.cursorX;
		var deltaY = cursorPosition[1] - this.cursorY;
		//update new X, Y
		this.cursorX += deltaX;
		this.cursorY += deltaY;
		this.blockSvg.moveBy(deltaX, deltaY);	
	}

	Block.prototype.highlight = function(){
		this.blockSvg.select();
	}

	Block.prototype.unhighlight = function(){
		
	}

