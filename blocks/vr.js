/**
 * Created by Jane on 5/11/2017.
 */
'use strict';



goog.require('Blockly.Blocks');


Blockly.defineBlocksWithJsonArray(
    [{
        "type": "move_object",
        "message0": "move object ID %1 x %2 y %3 z %4",
        "args0": [
            {
                "type": "input_value",
                "name": "ID"
            },
            {
                "type": "input_value",
                "name": "x"
            },
            {
                "type": "input_value",
                "name": "y"
            },
            {
                "type": "input_value",
                "name": "z"
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
            "type": "set_color",
            "message0": "set object ID's color %1 to  %2",
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
        }]


);

Blockly.Blocks['move_object'] = {
    init: function() {
        this.appendValueInput("ID")
            .setCheck(null)
            .appendField("move object ID");
        this.appendValueInput("x")
            .setCheck(null)
            .appendField("x");
        this.appendValueInput("y")
            .setCheck(null)
            .appendField("y");
        this.appendValueInput("z")
            .setCheck(null)
            .appendField("z");
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
            .appendField("set object ID's color");
        this.appendDummyInput()
            .appendField("to ")
            .appendField(new Blockly.FieldColour("#ff0000"), "NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};