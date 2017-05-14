
var recognition = new webkitSpeechRecognition();
var TIMEOUT = 500;
var waitingForParams = false;
var saidSetVariable = false;
var saidGetVariable = false;
var paramsChosen = [];
var blockChosen;
var paused = true;


var candidateParam = ["parameter", "param", "barometer", "input"]
var candidateSet = [ "set variable", "set barrier", "set terrible", "set durable", "set the", "set bearable"]
var candidateGet = [ "get variable", "get barrier", "get terrible", "get durable", "get the", "get bearable"]
var candidatePlay = ["play", "go", "run", "start"]
var candidateDirection = ["up", "down", "left", "right", "forward", "backward"];
var candidateDelete = ["delete", "remove"]
var candidateNumber = ["one"];
var candidateColor = ["red", "blue", "green"];
var candidateBool = ["true", "false"];


recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en";


recognition.onstart = function(){
    paused = false;
}

recognition.onend = function(event){

    setTimeout(function(){
        recognition.start();
        paused = false;
    }, TIMEOUT)
}

recognition.onresult = function(event) {
    //need to write the functions for param here
    var interim = "";
    var final = "";
    var processed = false;
    if (typeof(event.results) == 'undefined') {
       console.log("undefined")
    }

    for (var i = 0; i < event.results.length; i++) {
        //console.log(event.results);
        var result = event.results[i];
        if (result.isFinal) {
            final = result[0].transcript;
            document.getElementById('user-said').innerHTML = "Final: \"" + final + '\"';
        } else {
            interim += result[0].transcript;
            document.getElementById('user-said').innerHTML = "Inter: \"" + interim + '\"';
        }
    }

    //also check if user is hovering over a block in viewer
    if (userSaidParam(interim)) {
        if(Blockly.selected){
            blockChosen = Blockly.selected;
        }
        //console.log("in param");
        showParameterModal(blockChosen);
        waitingForParams = true;
        processed = true;
    } else if (userSaidSetVariable(interim)) {
       // console.log("in set variable");
        saidSetVariable = true;
        processed = true;
    } else if (userSaidGetVariable(interim)) {
        //console.log("in get variable");
        saidGetVariable = true;
        processed = true;
    } else if (userSaidPlay(interim)) {
       // console.log("in play");
        if(control.blocks.length > 0){
            Code.runJS();
            processed = true;
        }
    } else if (userSaidDelete(interim)){
        //console.log("delete");
        deleteBlock();
    }

    //setting parameters.
    if(waitingForParams && blockChosen != null){
        //get the parameters sequentially.
        var paramDict =  JSON.parse(sessionStorage["paramInfo"]);
        var paramsNeeded = paramDict[blockChosen.type];
        var index = paramsChosen.length; //will start from zero
        var paramType = paramsNeeded[index]["type"];
        var paramName = paramsNeeded[index]["name"];
        //for parameters that are numbers
        if(paramType == "number"){
            if(userSaidNumber(interim)){
                var patt = new RegExp("[0-9]+");
                var res = patt.exec(interim);
                paramsChosen.push(12);
                $('#val-'+index).html(1+index);
                processed = true;
            }
            //for move object function
        }else if(paramType == "direction"){
                if(userSaidDirection(interim)){
                    paramsChosen.push(interim);
                    $('#val-'+index).html(interim);
                    processed = true;
                }
        }else if(paramType == "color"){
            if(userSaidColor(interim)){
                paramsChosen.push(interim);
                processed = true;
            }
        }else if(paramType == "boolean"){
            if(userSaidBool(interim)){
                paramsChosen.push(interim);
                processed = true;
            }
        }



        //when all parameters are chosen
        if(paramsChosen.length == Object.keys(paramsNeeded).length){
            waitingForParams = false;
            console.log("process params");
            processParamsChosen(blockChosen);
        }
    }

    //setting variables
    if(saidSetVariable){

    }

    //get variable
    if(saidGetVariable){

    }




    //if end of process restart
    if(processed){
        console.log("processed. stop");
        recognition.stop();
        paused = true;
    }

}

recognition.onspeechend = function() {

    recognition.stop();
    paused = true;
}


/* helper functions for speech */

userSaid = function(str, commands){
    commands = commands.split(" ");
    //all should be included
    for (var i = 0; i < commands.length; i++) {
        if (str.indexOf(commands[i]) < 0){
            return false;
        }
    }
    return true;
}

userSaidParam = function(transcript){
    for (var i=0 ; i<candidateParam.length ; i++){
        var candidate = candidateParam[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

userSaidNumber = function(transcript){
    for (var i=0 ; i<candidateNumber.length ; i++){
        var candidate = candidateNumber[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

userSaidSetVariable = function(transcript){

    for (var i=0 ; i<candidateSet.length ; i++){
        var candidate = candidateSet[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

userSaidGetVariable= function(transcript){
    for (var i=0 ; i<candidateGet.length ; i++){
        var candidate = candidateGet[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

userSaidPlay = function(transcript){

    for (var i=0 ; i<candidatePlay.length ; i++){
        var candidate = candidatePlay[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

// userSaidNumber = function(trancript){
//     var patt = new RegExp("[0-9]+");
//     var res = patt.test(transcript);
//     return res
// }

userSaidDirection = function(transcript){
    for(var i=0; i<candidateDirection.length; i++){
        candidate = candidateDirection[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}


userSaidDelete = function(transcript){
    for(var i=0; i<candidateDelete.length; i++){
        candidate = candidateDelete[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

userSaidColor = function(transcript){
    for(var i=0; i<candidateColor.length; i++){
        candidate = candidateColor[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}

userSaidDirection = function(transcript){
    for(var i=0; i<candidateDirection.length; i++){
        candidate = candidateDirection[i];
        if(userSaid(transcript, candidate)){
            return true
        }
    }
    return false;
}


recognition.start();


