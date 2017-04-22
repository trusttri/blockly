
	var FLYOUT_BOUNDARY = 382;
	var DRAWER_BOUNDARY = 0;
	var CATEGORY_STARTING_POINT = 0;//26.55;
	var CATEGORY_SECTION_HEIGHT = 22; //26.55;
	var BLOCK_CATEGORIES = ["Logic", "Loops", "Math", "Text", "Lists", "Colour", "Variables", "Functions"];
	var category_index = -1;
	var count=0;
	Control = function(){
		this.flyoutOpen = false;
		this.chosenDrawer = "";
		this.blocks = [];
		this.currentBlock = null;
		this.chosenConnection = null;
		
		

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

	Control.prototype.getBlockFromEditor = function(cursorPosition){

	}
	
	Control.prototype.getBlockFromDrawer = function(cursorPosition){
		var blockElement = Blockly.mainWorkspace.toolbox_.tree_.getChildren()[0].blocks[0];
		this.currentBlock = new Block(Blockly.Xml.domToBlock(Blockly.mainWorkspace, blockElement), cursorPosition);
		Blockly.mainWorkspace.toolbox_.flyout_.placeNewBlock_(this.currentBlock.blockSvg);
		this.currentBlock.highlight();
		this.blocks.push(this.currentBlock);
		this.closeFlyout();
	}
	
	Control.prototype.moveHoldingBlock = function(cursorPosition){
		this.currentBlock.move(cursorPosition);
	}



	Block = function(blockSvg, cursorPosition){
		this.blockSvg = blockSvg;
		this.connection = blockSvg.getConnections_(false);
		this.cursorX = cursorPosition[0];
		this.cursorY = cursorPosition[1];
		console.log("firstX"+","+this.cursorX+","+this.cursorY);
	}

	Block.prototype.move = function(cursorPosition){
		count++;
		console.log(count);
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
