/**
 * Created by Jane on 5/12/2017.
 */

var testProcessed = false;
var spokenMove = false;
var spoken = true;


$(document).ready(function(){
    $('body').on("click", "#speechModalButton",(function(){
        console.log("hoo button");
        var modal = document.getElementById('saveModal');
        modal.style.display = "block";

    }));


});

//function for showing modal when user said "parameter"
var populateModal = function(){
    var blockSelected = Blockly.selected;
    var blockName = Blockly.selected.type;
    var blockStorage = JSON.parse(sessionStorage["blockParameters"]);
    var blockParameterInfo = blockStorage[blockName];
    var param = "";
    blockParamterInfo.forEach(function(param){
        param += '<div><div id="'+param+'" '>+param+'</div>' + '<div id="setter-'+param+'>'+'</div>';
    });
    $('#modal-body').append(param);
}


var processSpeech = function (transcript) {
    // testProcessed = false;
    // var userSaid = function (str, commands) {
    //
    //     commands = commands.split(" ").filter(function (word) {
    //         return word.length > 0;
    //     });
    //     for (var i = 0; i < commands.length; i++) {
    //         if (str.indexOf(commands[i]) < 0)
    //             return false;
    //     }
    //     return true;
    // };
    // var spokenSetVariableX = false;
    // var spokenGetVariableX = false;
    // spokenMove = false;
    // var candidateSet = ["variable i", "Variable I", "variable I", "bearable i", "bearable I", "set variable I'm", "set variable i'm", "set terrible I'm", "set terrible i'm", "set variable i", "set variable I", "set variable x", "set variable X", "set durable x", "set variable X", "set the x", "set the X", "set bearable X", "set bearable x"]
    // var candidateGet = []
    // var candidateMove = ['move', 'Move', 'Mo', 'Go', 'go', 'start', 'Start', 'star', 'Star', 'choose', 'Choose', 'Chose', 'chose'];
    //
    // candidateSet.forEach(function (candidate) {
    //     if (userSaid(transcript, candidate)) {
    //         spokenSetVariableX = true
    //     }
    // })
    //
    // candidateGet.forEach(function (candidate) {
    //     if (userSaid(transcript, candidate)) {
    //         spokenGetVariableX = true
    //     }
    // })
    //
    // candidateMove.forEach(function (candidate) {
    //     if (userSaid(transcript, candidate)) {
    //         spokenMove = true
    //     }
    // })
    //
    // if (spokenMove) {
    //     control.saidMove = true;
    // }
    //
    //
    // if (spokenSetVariableX) {
    //     setVariable();
    //     getVariable();
    //     testProcessed = true;
    // }
    // if (spokenGetVariableX) {
    //     getVariable();
    //     testProcessed = true;
    //
    // }
    //
    //
    // return testProcessed

}
