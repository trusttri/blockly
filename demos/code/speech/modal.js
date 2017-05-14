

$(document).ready(function(){
    $('body').on("click", "#speechModalButton",(function(){
        console.log("hoo button");
        showParameterModal();

    }));


});



var displayModal = function(){
    var modal = document.getElementById('saveModal');
    modal.style.display = "block";
}

var closeModal = function(){
    var modal = document.getElementById('saveModal');
    modal.style.display = "none";
}

//function for showing modal when user said "parameter"
var showParameterModal = function(blockSelected){
    if(blockSelected != null){
        $('#param-content').empty();
        var blockName = blockSelected.type;

        var blockStorage = JSON.parse(sessionStorage["paramInfo"]);
        var blockParameterInfo = blockStorage[blockName];
        var divString = "";
        console.log(blockName);
        console.log(blockStorage);
        console.log(blockParameterInfo);
        for(var i=0; i<Object.keys(blockParameterInfo).length; i++){
            var paramInfo = blockParameterInfo[i];
            var paramName = paramInfo["name"];
            console.log(paramName);
            divString += '<div><div id="wrapper-'+i + '">' + paramName + '</div>' + '<div id="val-'+i+'">'+'</div>';
        }

        console.log(divString);
        $('#param-content').append(divString);
        console.log("Modal show");
        displayModal();
    }
}


var processParamsChosen = function(blockChosen){
    var parametersInfo = JSON.parse(sessionStorage["paramInfo"]);
    var blockInfo = parametersInfo[blockChosen.type];
    for(var i=0; i<paramsChosen.length; i++){
        var paramChosen = paramsChosen[i];
        var paramFormat = blockInfo[i]["form"];
        var paramName = blockInfo[i]["name"];
        if(paramFormat == "input"){
            var idx = blockInfo[i]["idx"];
            //below is only possible because currently there are only number input blocks
            blockChosen.childBlocks_[idx].setFieldValue(paramChosen , "NUM");
        }else if(paramFormat == "field"){
            blockChosen.setFieldValue(paramChosen , paramName);
        }
    }
    /*
     //for setting field
     //instead of direction put field name
     Blockly.selected.setFieldValue("down", "direction");


     //for numbers
     Blockly.selected.setFieldValue("3", "NUM")



     Blockly.selected.childBlocks_[2].setFieldValue(110, "NUM")

     Blockly.selected.setFieldValue("#eeffee","color")

     Blockly.selected.setFieldValue("false","BOOL")
     */
}

var deleteBlock = function(){
    if(blockChosen){
        blockChosen.dispose(false, true);
    }

}

