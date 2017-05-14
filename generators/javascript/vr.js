/**
 * Created by Jane on 5/11/2017.
 */
'use strict';

goog.require('Blockly.JavaScript');



Blockly.JavaScript['move_object_time'] = function(block) {
    var value_id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
    var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
    var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
    var value_z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
    var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'moveLinear('+value_id+","+ value_x +"," + value_y +"," + value_z +"," +value_time +');\n';
    return code;
};


Blockly.JavaScript['move_object_direction'] = function(block) {
    var value_id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
    var value_distance = Blockly.JavaScript.valueToCode(block, 'distance', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_direction = block.getFieldValue('direction');
    var value_time = Blockly.JavaScript.valueToCode(block, 'time', Blockly.JavaScript.ORDER_ATOMIC);
    var code= "";
    if(dropdown_direction == "up"){
        code = 'moveLinear('+value_id+","+ "0," + value_distance +"," + "0," +value_time +');\n';
    }else if(dropdown_direction == "down"){
        code = 'moveLinear('+value_id+","+ "0," + -1*value_distance +"," + "0," +value_time +');\n';
    }else if(dropdown_direction == "right"){
        code = 'moveLinear('+value_id+","+ value_distance + "," + "0," + "0," +value_time +');\n';
    }else if(dropdown_direction == "left"){
        code = 'moveLinear('+value_id+","+ -1*value_distance + "," + "0," + "0," +value_time +');\n';
    }
    else if(dropdown_direction == "forward"){
        code = 'moveLinear('+value_id+","+  "0," + "0," + value_distance+"," +value_time +');\n';
    }else{
        code = 'moveLinear('+value_id+","+  "0," + "0," + -1*value_distance+"," +value_time +');\n';
    }

    return code;
};


Blockly.JavaScript['create_object'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    createCube
    var code = 'createCube(0, 10, -20,1);\n';
    return code;
};

Blockly.JavaScript['set_color'] = function(block) {
    var value_id = Blockly.JavaScript.valueToCode(block, 'ID', Blockly.JavaScript.ORDER_ATOMIC);
    var colour_name = block.getFieldValue('color');
    var code ='setColor(' + value_id +", '" + colour_name +'\');\n';
    return code;
};