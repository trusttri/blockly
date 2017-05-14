/**
 * Created by Jane on 5/12/2017.
 */
setVariable = function () {
    control.createVariable('x');

    var newBlockSvg = Blockly.mainWorkspace.toolbox_.flyout_.placeNewBlock_(Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[0]);
    control.currentBlock = new Block(newBlockSvg, cursorPosition);
    control.closeFlyout()
    control.currentBlock.blockSvg.select();
    control.currentBlock.blockSvg.moveBy(200, 10)
    control.blocks.push(control.currentBlock);
    control.currentBlock = null;


}

getVariable = function () {
    Blockly.mainWorkspace.toolbox_.tree_.getChildren()[7].select();
    var newBlockSvg = Blockly.mainWorkspace.toolbox_.flyout_.placeNewBlock_(Blockly.mainWorkspace.toolbox_.flyout_.currentBlocks[2]);
    control.currentBlock = new Block(newBlockSvg, cursorPosition);
    control.closeFlyout()
    control.currentBlock.blockSvg.select();
    control.currentBlock.blockSvg.moveBy(200, 10)
    control.blocks.push(control.currentBlock);
    control.currentBlock = null;
}


createVariable = function(variableName){
    Blockly.mainWorkspace.toolbox_.tree_.getChildren()[5].select();
    Blockly.mainWorkspace.createVariable(variableName)
}

initializeVariableList = function(){
    Blockly.mainWorkspace.variableList = ["foo"];
}
