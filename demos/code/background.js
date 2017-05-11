/**
 * Created by Jane on 1/11/2017.
 */
function createMaterial( path ) {
    var texture = THREE.ImageUtils.loadTexture(path);
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    return material;
}

function addBackground(){
    var materials = [
        createMaterial( '../images/skyX55+x.png' ), // right
        createMaterial( '../images/skyX55-x.png' ), // left
        createMaterial( '../images/skyX55+y.png' ), // top
        createMaterial( '../images/skyX55-y.png' ), // bottom
        createMaterial( '../images/skyX55+z.png' ), // back
        createMaterial( '../images/skyX55-z.png' )  // front
    ];

    // Create a large cube
    var mesh = new THREE.Mesh( new THREE.BoxGeometry( 2000, 2000, 2000, 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );

    // Set the x scale to be -1, this will turn the cube inside out
    mesh.scale.set(-1,1,1);
    scene.add( mesh );

    var light, materials;
    scene.add( new THREE.AmbientLight( 0x666666 ) );
    light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    var d = 300;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    scene.add( light );
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );


    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load( '../images/grasslight-big.jpg' );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    var ground_material = Physijs.createMaterial(
        new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } ),
        .8, .4);
    ground = new Physijs.PlaneMesh( new THREE.PlaneGeometry( 20000, 20000 ), ground_material, 0 );
    ground.position.y = -2;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );
}



function onProgress(progress) {
    // Use this to track loading progress
}

function onError(error) {
    // Called when errors occur during loading
}

function createSliderConstraint(mesh, ground, position) {
    var constraint = new Physijs.DOFConstraint(
        mesh, ground, position, (1,0,0));
    return constraint;
}

