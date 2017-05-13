/**
 * Created by Jane on 5/11/2017.
 */
'use strict';



goog.require('Blockly.Blocks');


Blockly.defineBlocksWithJsonArray(
    [
        {
            "type": "move_object_direction",
            "message0": "move object ID  %1    %2 meters %3 in %4 %5 second(s)",
            "args0": [
                {
                    "type": "input_value",
                    "name": "ID"
                },
                {
                    "type": "input_value",
                    "name": "distance"
                },
                {
                    "type": "field_dropdown",
                    "name": "direction",
                    "options": [
                        [
                            "up",
                            "up"
                        ],
                        [
                            "down",
                            "down"
                        ],
                        [
                            "forward",
                            "forward"
                        ],
                        [
                            "backward",
                            "backward"
                        ],
                        [
                            "left",
                            "left"
                        ],
                        [
                            "right",
                            "right"
                        ]
                    ]
                },
                {
                    "type": "input_dummy"
                },
                {
                    "type": "input_value",
                    "name": "time"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        },
        {
            "type": "create_object",
            "message0": "create new object",
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        },
        {
            "type": "set_color",
            "message0": "set object ID %1 's color  to  %2",
            "args0": [
                {
                    "type": "input_value",
                    "name": "ID"
                },
                {
                    "type": "field_colour",
                    "name": "NAME",
                    "colour": "#ff0000"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        }

    ]


);

Blockly.Blocks['move_object_direction'] = {
    init: function() {
        this.appendValueInput("ID")
            .setCheck(null)
            .appendField("move object ID ");
        this.appendValueInput("distance")
            .setCheck(null)
            .appendField("");
        this.appendDummyInput()
            .appendField("meters")
            .appendField(new Blockly.FieldDropdown([["up","up"], ["down","down"], ["forward","forward"], ["backward","backward"], ["left","left"], ["right","right"]]), "direction")
            .appendField("in");
        this.appendValueInput("time")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("second(s)");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['create_object'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("create new object");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['set_color'] = {
    init: function() {
        this.appendValueInput("ID")
            .setCheck(null)
            .appendField("set object ID");
        this.appendDummyInput()
            .appendField("'s color  to ")
            .appendField(new Blockly.FieldColour("#ff0000"), "NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

