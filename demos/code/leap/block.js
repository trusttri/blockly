/**
 * Created by Jane on 5/12/2017.
 */


Block = function(blockSvg, cursorPosition){
    this.blockSvg = blockSvg;
    this.workSpace = blockSvg.workSpace;
    this.connections = blockSvg.getConnections_(false);

    var fingerOffset = [document.getElementsByClassName('blocklyToolboxDiv')[0].offsetWidth, document.getElementById('content_blocks').offsetTop];
    var processedCursor = [cursorPosition[0] - fingerOffset[0], cursorPosition[1] - fingerOffset[1] ]

    this.cursorX = processedCursor[0];
    this.cursorY = processedCursor[1];
    this.dragStart = true;
    this.unplug = 0;

}


Blockly.RenderedConnection.prototype.closestSecond = function(maxLimit, dx, dy) {
    return this.dbOpposite_.searchForClosestSecond(this, maxLimit, dx, dy);
};


Blockly.ConnectionDB.prototype.isInYRangeSecond_ = function(index, baseY, maxRadius) {
    return (Math.abs(this[index].y_ - baseY) <= maxRadius);
};

Blockly.ConnectionDB.prototype.searchForClosestSecond = function(conn, maxRadius, dxy) {
    // Don't bother.
    if (!this.length) {
        return {connection: null, radius: maxRadius};
    }

    // Stash the values of x and y from before the drag.
    var baseY = conn.y_;
    var baseX = conn.x_;
    //for some reason, shouldn't update here
    // conn.x_ = baseX + dxy.x;
    // conn.y_ = baseY + dxy.y;

    // findPositionForConnection finds an index for insertion, which is always
    // after any block with the same y index.  We want to search both forward
    // and back, so search on both sides of the index.
    var closestIndex = this.findPositionForConnection_(conn);

    var bestConnection = null;
    var bestRadius = maxRadius;
    var temp;

    // Walk forward and back on the y axis looking for the closest x,y point.
    var pointerMin = closestIndex - 1;
    while (pointerMin >= 0 && this.isInYRangeSecond_(pointerMin, conn.y_, maxRadius)) {
        temp = this[pointerMin];
        //console.log("search for second");
        if (conn.isConnectionAllowedSecond(temp, bestRadius)) {
            bestConnection = temp;
            bestRadius = temp.distanceFromSecond(conn);
        }
        pointerMin--;
    }
    var pointerMax = closestIndex;
    while (pointerMax < this.length && this.isInYRange_(pointerMax, conn.y_,
        maxRadius)) {
        temp = this[pointerMax];
        if (conn.isConnectionAllowed(temp, bestRadius)) {
            bestConnection = temp;
            bestRadius = temp.distanceFrom(conn);
        }
        pointerMax++;
    }

    // Reset the values of x and y.
    conn.x_ = baseX;
    conn.y_ = baseY;

    // If there were no valid connections, bestConnection will be null.
    return {connection: bestConnection, radius: bestRadius};
};

Blockly.RenderedConnection.prototype.distanceFromSecond = function(otherConnection) {
    var xDiff = this.x_ - otherConnection.x_;
    var yDiff = this.y_ - otherConnection.y_;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

Blockly.RenderedConnection.prototype.isConnectionAllowedSecond = function(candidate,maxRadius) {
    if (this.distanceFromSecond(candidate) > maxRadius) {
        return false;
    }

    return Blockly.RenderedConnection.superClass_.isConnectionAllowed.call(this,
        candidate);
};

Control.prototype.highlightCon = function(){

    //Blockly.selected && Blockly.highlightedConnection_ && a != Blockly.DELETE_AREA_TOOLBOX ? (Blockly.localConnection_.connect(Blockly.highlightedConnection_),
    if(this.currentBlock.blockSvg!=null && Blockly.highlightedConnection_!=null){
        Blockly.localConnection_.connect(Blockly.highlightedConnection_);
        if(Blockly.localConnection_.isSuperior()){
            Blockly.highlightedConnection_.getSourceBlock().connectionUiEffect();
        }else{
            Blockly.localConnection_.getSourceBlock().connectionUiEffect();
        }
    }
    if(Blockly.highlightedConnection_ !=null){
        Blockly.highlightedConnection_.unhighlight();
        Blockly.highlightedConnection_ = null;
    }

}


Block.prototype.highlightClosestConnection = function(){
    var blockSvg = this.blockSvg;
    // Check to see if any of this block's connections are within range of
    if(blockSvg.dragStartXY_ != null){
        var dxy = goog.math.Coordinate.difference(blockSvg.getRelativeToSurfaceXY(), blockSvg.dragStartXY_);//dxy  = offset
        // console.log("dxy");
        // console.log(dxy);

        //from blockly code. modified
        //another block's connection.
        var myConnections = blockSvg.getConnections_(false);
        // Also check the last connection on this stack
        var lastOnStack = blockSvg.lastConnectionInStack_();
        if (lastOnStack && lastOnStack != blockSvg.nextConnection) {
            myConnections.push(lastOnStack);
        }
        var closestConnection = null;
        var localConnection = null;
        //var radiusConnection = Blockly.SNAP_RADIUS;
        var radiusConnection = 50;
        for (var i = 0; i < myConnections.length; i++) {
            var myConnection = myConnections[i];

            var neighbour = myConnection.closestSecond(radiusConnection, dxy);
            //console.log(neighbour);
            if (neighbour!=null && neighbour.connection) {
                //console.log("chosen");
                closestConnection = neighbour.connection;
                localConnection = myConnection;
                radiusConnection = neighbour.radius;
                //console.log(closestConnection);
            }
        }

        // Remove connection highlighting if needed.
        if (Blockly.highlightedConnection_ &&
            Blockly.highlightedConnection_ != closestConnection) {
            Blockly.highlightedConnection_.unhighlight();
            Blockly.highlightedConnection_ = null;
            Blockly.localConnection_ = null;
        }

        // Add connection highlighting if needed.
        if (closestConnection &&
            closestConnection != Blockly.highlightedConnection_) {
            closestConnection.highlight();

            Blockly.highlightedConnection_ = closestConnection;
            Blockly.localConnection_ = localConnection;

        }

    }

}

Block.prototype.getClosestConnection = function(){
    var pairConnections = [];
    var blockSvg = this.blockSvg;
    this.connections.forEach(function(connection){
        if(blockSvg.dragStartXY_ != null){
            var position = blockSvg.getRelativeToSurfaceXY();
            var offset = goog.math.Coordinate.difference(position, blockSvg.dragStartXY_);
            var result = connection.dbOpposite_.searchForClosest(connection, 100, offset);
            pairConnections.push([connection, result.connection, result.radius]);
        }

    });

    var shortestDistance = 20;
    var optimalConnection = null;
    pairConnections.forEach(function(pair){
        var distance = pair[2];
        if(distance < shortestDistance){
            optimalConnection = [pair[0], pair[1]];
            shortestDistance = distance;
        }

    });

    return optimalConnection;
}

Block.prototype.stopMove = function(){
    this.dragStart = true;
}


Block.prototype.move = function(cursorPosition){
    if((this.blockSvg.previousConnection != null && this.blockSvg.previousConnection.isConnected()) || (this.blockSvg.outputConnection != null && this.blockSvg.outputConnection.isConnected())){
        this.blockSvg.unplug();
        this.unplug+=1;
        console.log("uplugged");
    }


    var layoutOffset = [0, $('.tabmax')[0].offsetHeight];
    var blockWidth = this.blockSvg.width;
    var blockHeight = this.blockSvg.height;
    var processedCursor = [cursorPosition[0] - layoutOffset[0] - blockWidth/2, cursorPosition[1] - layoutOffset[1] - blockHeight/2]
    if(this.dragStart){
        this.blockSvg.dragStartXY_ = this.blockSvg.getRelativeToSurfaceXY();
        this.dragStart = false;
    }
    var beforeRelativeX = this.blockSvg.getRelativeToSurfaceXY()['x'];
    var beforeRelativeY = this.blockSvg.getRelativeToSurfaceXY()['y'];

    var deltaX = processedCursor[0] - beforeRelativeX; //before it was this.cursorX
    var deltaY = processedCursor[1] - beforeRelativeY;
    //update new X, Y
    this.cursorX += deltaX;
    this.cursorY += deltaY;
    this.blockSvg.moveBy(deltaX, deltaY);

    var afterRelativeX = this.blockSvg.getRelativeToSurfaceXY()['x'];
    var afterRelativeY = this.blockSvg.getRelativeToSurfaceXY()['y'];

    //check for disconnect


}

Block.prototype.highlight = function(){
    this.blockSvg.select();
}

Block.prototype.unhighlight = function(){

}

Blockly.BlockSvg.prototype.addSelectForMove = function() {
    Blockly.utils.addClass(this.svgGroup_, "blocklyLeapSelected");
    var a = this;
    do {
        var b = a.getSvgRoot();
        b.parentNode.appendChild(b);
        a = a.getParent()
    } while (a)
};

Blockly.BlockSvg.prototype.removeSelectForMove = function() {
    Blockly.utils.removeClass(this.svgGroup_, "blocklyLeapSelected");

};


Blockly.BlockSvg.prototype.selectForMove = function() {

    if (this.isShadow() && this.getParent()) {
        // Shadow blocks should not be selected.
        this.getParent().selectForMove();
        return;
    }
    if (BLOCK_SELECTED_FOR_MOVE == this) {
        return;
    }
    var oldId = null;
    if (BLOCK_SELECTED_FOR_MOVE) {
        oldId = BLOCK_SELECTED_FOR_MOVE.id;
        // Unselect any previously selected block.
        Blockly.Events.disable();
        try {
            if(BLOCK_SELECTED_FOR_MOVE != null){
                BLOCK_SELECTED_FOR_MOVE.unselectForOtherMove();
            }

        } finally {
            Blockly.Events.enable();
        }
    }

    BLOCK_SELECTED_FOR_MOVE = this;
    this.addSelectForMove();

};

Blockly.BlockSvg.prototype.unselectForOtherMove = function() {
    if (BLOCK_SELECTED_FOR_MOVE != this) {
        return;
    }
    this.removeSelectForMove();
    BLOCK_SELECTED_FOR_MOVE = null;

};
