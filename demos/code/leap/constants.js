	var FLYOUT_BOUNDARY = 382;
	var DRAWER_BOUNDARY = -20;
	var CATEGORY_STARTING_POINT = 0;//26.55;
	var CATEGORY_SECTION_HEIGHT = 57; //26.55;
	var BLOCK_CATEGORIES = ["Logic", "Loops", "Math", "Text", "Lists", "Colour", "","Variables", "Functions"];
	var category_index = -1;
	var FLYOUT_BLOCKS_POSITION = {"Colour":[],"Logic":[], "Loops":[], "Math":[], "Text":[], "Lists":[],  "Variables":[], "Functions":[]};
	var FLYOUT_RANGE = {"Colour":[],"Logic":[], "Loops":[], "Math":[], "Text":[], "Lists":[],  "Variables":[], "Functions":[]};
	var BLOCK_SELECTED_FOR_MOVE;
	// Blockly.INPUT_VALUE = 1;
	// Blockly.OUTPUT_VALUE = 2;
	// Blockly.NEXT_STATEMENT = 3;
	// Blockly.PREVIOUS_STATEMENT = 4;
	// Blockly.DUMMY_INPUT = 5;