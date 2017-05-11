
Geometry= function(x, y, z, mesh){
    this.id = objectNextId++;
    idToObject[this.id] = this;
    this.mesh = mesh;
    this.mesh.material.color.setRGB(Math.random(), Math.random(), Math.random());
    this.mesh.position.set(x + Math.random() * 3, y + Math.random()*3, z + Math.random() * 3)
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.score = 0;
    this.label_show = false;
    this.mesh.rotation.y = 0;
    this.reticulum_hit = false;
    scene.add(this.mesh);

    this.getObject = function(){
        return this.mesh
    }

    this.checkChild = function(){
        if (this.mesh.children.length >0){
            return true
        }
    }

    this.setPosition = function(x, y, z){
        this.getObject().position.set(x, y, z)
        this.getObject().__dirtyPosition = true;
    }

    this.getX = function(){
        return this.getObject().position.x
    }

    this.getY = function(){
        return this.getObject().position.y
    }

    this.getZ = function(){
        return this.getObject().position.z
    }

    this.setXRotation = function(r){
        this.getObject().rotateX(r)
        this.getObject().__dirtyRotation = true;
    }

    this.setYRotation = function(r){
        this.getObject().rotateY(r);
        this.getObject().__dirtyRotation = true;
    }

    this.setZRotation = function(r){
        this.getObject().rotateZ(r);
        this.getObject().__dirtyRotation = true;;
    }

    this.setColor = function(rgbString){
        //rgbString is in format of "#ff0000"

        this.getObject().material.color = new THREE.Color(rgbString);
    }

    this.remove = function(){
        scene.remove(this.getObject())
    }

    this.moveLinear = function(x, y, z){
        this.getObject().setLinearVelocity(new THREE.Vector3(x, y, z))
    }

    this.stopMove = function(){
        var _vector = new THREE.Vector3;
        _vector.set( 1, 1, 1 );
        this.getObject().setAngularFactor( _vector );
        this.getObject().setLinearFactor( _vector );
    }

    this.increaseScore = function(delta){
        this.score += delta;
    }

    this.decreaseScore = function(delta){
        this.score -= delta;
    }

    this.getScore = function(){
        return this.score;
    }

    this.returnReticulumHit = function(){
        return this.reticulum_hit;
    }

    this.makeHitTrue = function(){
        this.reticulum_hit = true;
    }

    this.getLinearVelocityX = function(){
        return this.getObject()._physijs.linearVelocity.x;
    }

    this.getLinearVelocityY = function(){
        return this.getObject()._physijs.linearVelocity.y;
    }

    this.getLinearVelocityZ = function(){
        return this.getObject()._physijs.linearVelocity.z;
    }

    this.handle_collision = function(other_object, linear_velocity, angular_velocity){
        console.log(this);
        if(other_object!==ground){
            this.mesh.material.color.setRGB(Math.random(), Math.random(), Math.random());
            if(idToLabel[this.id]) {
                this.increaseScore(5)
            }
        }
    }

    this.give_collision_effect = function(){
        this.getObject().addEventListener('collision', this.handle_collision.bind(this));
    }


    this.addObjectReticulum = function(){
        owner = this;
        Reticulum.add( this.getObject(), {
            onGazeOver: function(){
                this.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
                this.setLinearVelocity(new THREE.Vector3(2, 10.5, 1))
                owner.makeHitTrue()
            },
            onGazeOut: function(){
                var _vector = new THREE.Vector3;
                _vector.set( 1, 1, 1 );
                this.setAngularFactor( _vector );
                this.setLinearFactor( _vector );

            },
            onGazeLong: function(){
                this.jump = true;
            },
            onGazeClick: function(){
            }
        });
    }

}



Cube = function(x, y, z, stable){
    cube_geo = new THREE.BoxGeometry(3, 3, 3);
    for(var i = 0; i< cube_geo.faces.length; i++){
        var face = cube_geo.faces[i];
        face.color.setHex(Math.random()* 0xffffff);
    }
    this.geometry = new Geometry(x,y,z,new Physijs.BoxMesh(cube_geo, new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors}), stable))
}

Sphere = function(x, y, z, stable){
    //radius, widthSegments, heightSegments
    //widthSegments: number of horizontal segments. min: 3, default: 8
    this.geometry = new Geometry(x, y, z, new Physijs.SphereMesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshLambertMaterial({color: 0xfffff}), stable))
}

Plane = function(x, y, z){
    //width: width along the X axis, height: height along Y axis, widthSegments: optional. default = 1, heightSegments: optional, default = 1
    this.shape = new Shape(x, y, z, new Physijs.PlaneMesh(new THREE.PlaneGeometry(3, 5, 12), new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide})))
}


Music = {
    on: false,
    pauseMusic: function(){
        on = false
        playList.pause()
    },
    stopMusic: function(){
        on = false
        playList.stop()
    },
    playMusic: function(){
        on = true
        var loader = new THREE.AudioLoader();
        loader.load(
            // resource URL
            '../audio/youth.mp3',
            function ( audioBuffer ) {
                playList.setBuffer( audioBuffer );
                playList.play();
            },
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        );
    }
}

//change position of user
Camera = {
    new_x : 0,
    new_y : 0,
    new_z : 0,
    setPosition: function(x, y, z){
        this.new_x = x;
        this.new_y = y;
        this.new_z = z;
        new_group = new THREE.Group();
        new_group.position.set(x, y, z);
        scene.add(new_group);
        new_group.add(camera);
    },

    getPosition: function(){
        return camera.position
    },

    getX: function(){
        return camera.position.x;
    },

    getY: function(){
        return camera.position.y;
    },

    getZ: function(){
        return camera.position.z;
    },

    moveForward: function(delta_x,delta_y,delta_z){
        this.new_x = this.new_x + delta_x;
        this.new_y = this.new_y + delta_y;
        this.new_z = this.new_z + delta_z;
        new_group = new THREE.Group();
        new_group.position.set(this.new_x, this.new_y, this.new_z);
        scene.add(new_group);
        new_group.add(camera);
    }
}

Gravity = {
    setGravity: function(x, y, z) {
        scene.setGravity(new THREE.Vector3(x, y, z));
        //to give no gravity give (0,0,0)
    }
}

Ground = {
    setPosition: function(x, y, z){
        ground.position.set(x, y, z)
        ground.__dirtyPosition = true
    },
    getPosition: function(){
        return ground.position
    },
    getX: function(){
        return ground.position.x
    },
    getY: function(){
        return ground.position.y
    },
    getZ: function(){
        return ground.position.z
    }
}

Fog = {
    setFog: function(color, near, far){
        scene.fog = new THREE.Fog(color, near, far)//0.015: near, 100: far
    }
}


//////////////////////////// for AI blocks ////////////////////////////
function createCube(x,y,z, stable){ //what if we wanted to add random?
    c = new Cube(x,y,z, stable);
    return c.geometry.id
}

function createSphere(x,y,z, stable){ //what if we wanted to add random?
    s = new Sphere(x,y,z, stable);
    return s.geometry.id
}

function createScoreLabel(id){
    if(idToObject[id].label_show === false){
        label = new ScoreLabel(id);
    }
}


function setCubePosition(id, x, y, z){
    idToObject[id].setPosition(x,y,z)
}

function returnCubeX(id){
    return idToObject[id].getX();
}

function returnCubeY(id){
    return idToObject[id].getY();
}

function returnCubeZ(id){
    return idToObject[id].getZ();
}

function returnCubeCount(num){
    return objectNextId;
}

function rotateCubeX(id, r){
    idToObject[id].setXRotation(r);
}

function rotateCubeY(id, r){
    idToObject[id].setYRotation(r);
}

function rotateCubeZ(id, r){
    idToObject[id].setZRotation(r);
}

function moveLinear(id, x, y, z){
    idToObject[id].moveLinear(x, y, z);
}

function stopCubeMove(id){
    idToObject[id].stopMove();
}

function setGravity(x, y, z){
    Gravity.setGravity(x, y, z);
}

function setGroundPosition(x, y, z){
    //not finished yet
    Ground.setPosition(x, y, z)
}

function setCamera(x, y, z){
    Camera.setPosition(x, y, z)
}

function setColor(id, rgbString){
    alert("hi");
    alert(rgbString);

    idToObject[id].setColor(rgbString);
}


function removeSprite(id){
    if(idToObject[id]){
        idToObject[id].remove();
    }
}

function addObjectReticulum(id){
    idToObject[id].addObjectReticulum()
}

function playMusic(){
    Music.playMusic()
}

function stopMusic(){
    Music.stopMusic()
}

function setFog(color, near, far) {
    Fog.setFog(color, near, far)
}

function increaseScore(id, delta){
    idToObject[id].increaseScore(delta);
}

function decreaseScore(id, delta){
    idToObject[id].decreaseScore(delta);
}

///////////////functions with return value///////////////

function getSpriteScore(id){
    return idToObject[id].getScore();
}


function getRotationX(id){
    return idToObject[id].getObject().rotation.x;
}

function getRotationY(id){
    return idToObject[id].getObject().rotation.y;
}

function getRotationZ(id){
    return idToObject[id].getObject().rotation.z;
}

function getCameraX(){
    return Camera.getX();
}

function getCameraY(){
    return Camera.getY();
}

function getCameraZ(){
    return Camera.getZ();
}

function getGroundX(){
    return Ground.getX();
}

function getGroundY(){
    return Ground.getY();
}

function getGroundZ(){
    return Ground.getZ();
}

function getLinearVeloctiyX(id){
    return idToObject[id].getLinearVelocityX();
}

function getLinearVelocityY(id){
    return idToObject[id].getLinearVelocityY();
}

function getLinearVelocityZ(id){
    return idToObject[id].getLinearVelocityZ();
}


function getColorR(id){
    return idToObject[id].getObject().material.color.r;
}

function getColorG(id){
    return idToObject[id].getObject().material.color.g;
}

function getColorB(id){
    return idToObject[id].getObject().material.color.b;
}

function musicPlaying(){
    return Music.on
}

function labelShowing(id){
    return idToObject[id].label_show;
}

function returnReticulumHit(id){
    if(idToObject[id].reticulum_hit === true){
        return 1;
    }else{
        return 0;
    }
}

function switchReticulumHit(id){
    if(idToObject[id].reticulum_hit === true) {
        idToObject[id].reticulum_hit = false
        return 2;
    }
    return -1;
}

function giveCollisionEffect(id){
    idToObject[id].give_collision_effect();
}

function userMoveForward(x, y, z){
    Camera.moveForward(x, y, z);
}

///function for dropdown
function moveForwardBackward(id, direction){

    if(direction == 'FORWARD'){
        moveLinear(id, 0, 0, 10);
    }else if(direction == 'BACKWARD'){
        moveLinear(id, 0, 0, -10);
    }else if(direction == 'RIGHT'){
        moveLinear(id, 5, 0, 0);
    }else if(direction == 'LEFT'){
        moveLinear(id, -5, 0, 0);
    }else if(direction == 'UP'){
        moveLinear(id, 0, 10, 0);
    }else if(direction == 'DOWN'){
        moveLinear(id, 0, -10, 0);
    }
    else{
        moveLinear(id, 0, 0, 0);
    }
}

