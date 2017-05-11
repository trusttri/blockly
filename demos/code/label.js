/**
 * Created by Jane on 1/17/2017.
 */

ScoreLabel = function(object_id){

    idToLabel[object_id] = this;
    this.parent = idToObject[object_id];
    this.parent.label_show = true;
    this.id = object_id;
    texture = new THREE.Texture(canvas);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    geometry = new THREE.BoxGeometry( 2, 2, 2 );
    this.mesh = new Physijs.BoxMesh( geometry, material,0 );

    this.mesh.position.set(this.parent.getObject().position.x+10,this.parent.getObject().position.y+10.5,this.parent.getObject().position.z-5.5 );

    //this.mesh.position.set(4, 5, -3)
    //this.parent.getObject().add( this.mesh );
    scene.add(this.mesh)
    canvas.width = canvas.height = 128;

    this.getId = function(){
        return this.id
    }

    this.update = function(text){
        ctx.font = '30pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(10, 10, canvas.width - 5, canvas.height - 5);
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width /2, canvas.height /2);

        texture.needsUpdate = true;
        this.mesh.position.set(this.parent.getObject().position.x+4,this.parent.getObject().position.y+4.5,this.parent.getObject().position.z-3.5 );
        this.mesh.__dirtyPosition = true;
    }
}