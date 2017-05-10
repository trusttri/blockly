/*****************************************************************/
/******** SPEECH RECOGNITION SETUP YOU CAN IGNORE ****************/
/*****************************************************************/
var DEBUGSPEECH = true;
var processed;
var debouncedProcessSpeech = _.debounce(processSpeech, 500);

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function(event) {
	console.log(event);
  // Build the interim transcript, so we can process speech faster
  var transcript = '';
  var hasFinal = false;
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal)
      hasFinal = true;
    else
      transcript += event.results[i][0].transcript;
  }

  if (DEBUGSPEECH) {
    if (hasFinal){
		//console.log("fin!")
		document.getElementById('user-said').innerHTML = "You said: \"" +transcript+'\"';
	}else{
		//console.log("waiting ");
		document.getElementById('user-said').innerHTML = "You are saying: \"" +transcript+'\"';
	}
	   
  }

  processed = debouncedProcessSpeech(transcript);
   
  // If we reacted to speech, kill recognition and restart
  //console.log("processed is")
  //console.log(processed)
  if (processed) {
	console.log("stopeed recognition");
    recognition.stop();
  }else{
  }
};
// Restart recognition if it has stopped
recognition.onend = function(event) {
  setTimeout(function() {
    
    recognition.start();
	if (DEBUGSPEECH){
		console.log("waiting")
	}
  }, 1000);
};
recognition.start();
/*****************************************************************/
/******** END OF SPEECH RECOG SETUP ******************************/
/*****************************************************************/

