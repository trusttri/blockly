/**
 * Created by Jane on 5/11/2017.
 */
'use strict';

goog.require('Blockly.JavaScript');

Blockly.JavaScript['move_object'] = function(block) {
    var value_id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
    var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
    var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
    var value_z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'moveLinear('+value_id+","+ value_x +"," + value_y +"," + value_z +');\n';
    return code;
};

Blockly.JavaScript['set_color'] = function(block) {
    var value_id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
    var colour_name = block.getFieldValue('NAME');
    // TODO: Assemble JavaScript into code variable.
    var code = 'setColor(' + value_id +", " + colour_name +');\n';
    return code;
};