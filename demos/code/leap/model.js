	
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

	Control.prototype.checkInFlyout = function(cursorPosition){
		if(cursorPosition[0]<Blockly.mainWorkspace.toolbox_.flyout_.width_+100){
						return true;
		}
		return false;
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
		if(BLOCK_SELECTED_FOR_MOVE!=null && cursorPosition[2] > 80){
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
				
				closestBlock.blockSvg.select();
				if(cursorPosition[2] < 200){
					console.log("close");
					this.candidateBlock = closestBlock;
				}
			}
		}
		
	}

	Control.prototype.hoverOverFlyout = function(cursorPosition){
		this.candidateBlock = null;
		if(Blockly.mainWorkspace.toolbox_.flyout_.isVisible()){
			
			if(BLOCK_SELECTED_FOR_MOVE!=null && cursorPosition[2] > 200){
				BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove()
			
			}
			
	
			var blocksBoundary = FLYOUT_RANGE[control.chosenDrawer];
			if(blocksBoundary != null){
				for(var i=0 ; i<(blocksBoundary.length-1); i++){
					var currentY = cursorPosition[1];
					if(blocksBoundary[i] < currentY && currentY < blocksBoundary[i+1]){
					
						this.candidateBlock = Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[i];
						this.candidateBlock.select();
						if(cursorPosition[2] < 80){
							
							//this.candidateBlock.selectForMove();
						}
						
						break;
					}			
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
			this.currentBlock.blockSvg.selectForMove();
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
		
		// if(BLOCK_SELECTED_FOR_MOVE!=null && cursorPosition[2] > 80){
			// BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove()
			// BLOCK_SELECTED_FOR_MOVE = null;
		// }else if(BLOCK_SELECTED_FOR_MOVE!= this.currentBlock.blockSvg && cursorPosition[2] <80){
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
	
	
	Control.prototype.shrinkSize = function(){
		var svg = Blockly.mainWorkspace.getParentSvg();
		svg.setAttribute('width','600px');
	}
	
