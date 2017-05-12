var hand;
var cursorPosition = [0, 0, 0];
var control = new Control();
var windowSize = [window.innerWidth, window.innerHeight];
var leapFrame;
var leapController;


handCursorUpdate = function (hand, frame) {
    //var leapPoint = hand.screenPosition();
    var leapPoint = hand.palmPosition;
    var iBox = frame.interactionBox;
    var normalizedPoint = iBox.normalizePoint(leapPoint, true);
    var appX = normalizedPoint[0] * windowSize[0]
    var appY = (1 - normalizedPoint[1]) * windowSize[1]
    cursorPosition[0] = appX;
    cursorPosition[1] = appY;
}

checkInFlyout = function (cursorPosition) {
    //var DRAWER_BOUNDARY = document.getElementsByClassName('blocklyToolboxDiv')[0].offsetWidth;
    var DRAWER_BOUNDARY = document.getElementsByClassName('blocklyToolboxDiv')[0].offsetHeight + document.getElementsByClassName('tabmax')[0].offsetHeight;
    //if(DRAWER_BOUNDARY - 20 <cursorPosition[0] && cursorPosition[0] < Blockly.mainWorkspace.toolbox_.flyout_.width_+200){
    if (DRAWER_BOUNDARY < cursorPosition[1] && cursorPosition[1] < 650) {
        console.log("flyout");

        return true;
    }
    console.log("viewr");

    return false;
}



resizeForCursor = function () {
    var c = document.getElementById("abs_mapping_stage");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}


mapCursor = function () {
    var abs = {};
    abs.width = window.innerWidth;
    abs.height = window.innerHeight;
    abs.stage = new Kinetic.Stage({
        container: 'abs_mapping_stage',
        width: abs.width,
        height: abs.height
    });

    abs.layer = new Kinetic.Layer();


    abs.tip = new Kinetic.Circle({
        x: 239,
        y: 75,
        radius: 10,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 3.5,
        opacity: .5,
        visible: true
    });

    abs.layer.add(abs.tip);
    abs.stage.add(abs.layer);


    abs.scale = 600 / 470;
    abs.anim = new Kinetic.Animation(function (frame) {
        var leap_frame = leapController.frame(); //leap is a connected leapController object
        var hand = leap_frame.hands[0];
        if (leap_frame.valid && hand != null) {
            var leapPoint = hand.palmPosition;
            var iBox = leap_frame.interactionBox;
            var normalizedPoint = iBox.normalizePoint(leapPoint, true);

            var appX = normalizedPoint[0] * windowSize[0]
            var appY = (1 - normalizedPoint[1]) * windowSize[1]

            abs.tip.x(appX);
            abs.tip.y(appY);
        } else if (abs.tip.y() < 0) {
            abs.tip.x(abs.width / 2);
            abs.tip.y(abs.height / 2);
        }

    }, abs.layer);

    abs.anim.start();

}


leapController = Leap.loop({enableGestures: true}, function (frame) {
    leapFrame = frame;
    hand = frame.hands[0];
    control.timestamp = frame["timestamp"];

    if (init) {
        if (Blockly.mainWorkspace != null && control != null) {
            control.getBlocksPositionInFlyout();
            control.getBlockSectionRange();
            init = false;
            Blockly.mainWorkspace.variableList = [];

        }

    }

    if (hand && Blockly.mainWorkspace != null) {

        resizeForCursor();

        handCursorUpdate(hand, frame);

        var extendedFingers = 0;
        for (var f = 0; f < hand.fingers.length; f++) {
            var finger = hand.fingers[f];
            if (finger.extended) extendedFingers++;
        }

        var hoveringPlace = control.getHoveringPlace(cursorPosition);//hover:drawer or viewer

        if (extendedFingers == 5) {
            if (hoveringPlace == "drawer" && control.currentBlock == null) {//should allow to open drawer even though selected
                control.openClosestFlyout(cursorPosition);
            } else if (hoveringPlace == "viewer") {
                if (Blockly.mainWorkspace.toolbox_.flyout_.isVisible()) {
                    if (checkInFlyout(cursorPosition)) {
                        control.hoverOverFlyout(cursorPosition);
                    } else {
                        control.closeFlyout();
                    }
                } else {
                    if (control.currentBlock != null) { //let the block go
                        control.highlightCon();
                        control.stopMovingBlock();
                    } else {
                        //find the closest block and highlight it
                        control.hoverOverViewer(cursorPosition);

                    }
                }

            }

        } else if (extendedFingers <= 1) { //hand is grabbing for something
            if (hoveringPlace == "viewer") {
                if (Blockly.mainWorkspace.toolbox_.flyout_.isVisible()) {//is flyout open?
                    if (control.currentBlock == null && checkInFlyout(cursorPosition)) {
                        console.log("trying to get from flyout");
                        control.getBlockFromDrawer(cursorPosition);
                        control.closeFlyout();
                    }

                } else {
                    if (control.currentBlock != null) {
                        control.currentBlock.highlightClosestConnection();
                        control.moveHoldingBlock(cursorPosition);

                        //control.listenForConnection();

                    } else {
                        console.log("trying to get from viewr");
                        //control.getBlockFromViewer(cursorPosition);
                    }

                }


            }
        }
    }//hand

}).use('screenPosition', {scale: 0.57});

