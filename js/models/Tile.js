function Tile (attrs) {
	this.x = attrs.x;
	this.y = attrs.y;

	this.height = attrs.height || 4;
	this.material = Materials.getMaterial(attrs.material);
	this.permanentMaterial = this.material;
	this.createAddGraphicObject();

	this.beginDragTile = function (event) {
		this.baseHeight = this.height;
		this.startLocation = {x: event.clientX, y: event.clientY};
		Tile.draggingTile = this;
	}

	this.paint = function (material) {
		if (material.type === 'Texture') {
			this.permanentMaterial = this.material = material;	
		} else {
			this.graphicObject.material = this.permanentMaterial = this.material = material.material;
		}
		this.createAddGraphicObject()
	}
}

Tile.prototype.createAddGraphicObject = function () {
	var sideGeom = new THREE.CylinderGeometry(10, 10, Tile.stepHeight, 6, 1, true);
	var topGeom = new THREE.CircleGeometry( 10, 6 );
	var surfaceMaterial;
	var userObject = {gameType: "Tile", mapX: this.x, mapY: this.y};
	if (this.permanentMaterial.type === "Texture") {
		surfaceMaterial = new THREE.MeshBasicMaterial ({
			map: this.permanentMaterial.material
		});
	} else {
		surfaceMaterial = new THREE.MeshBasicMaterial ({
			color: this.permanentMaterial.color
		});
	}
	var hex = new THREE.Object3D();
    hex.castShadow = true;
    hex.receiveShadow = true;
	var x = -75 + 15 * this.x + (this.y % 2 == 0 ? 0 : 0),
		y = 0,
		z = 90 - 17.2 * this.y - (this.x % 2 == 0 ? 0 : 8.6);
	//hex.position.set(x, y, z);
	//hex.scale.y = this.height;
    //hex.rotation.y = Math.PI / 2;
    hex.name = "hex X:" + this.x + " Z:" + this.y;
    hex.scale.y = this.height;
    hex.userObject = userObject;
    
    var sideMesh = new THREE.Mesh(sideGeom, surfaceMaterial);
    sideMesh.gameType = 'Tile';
    sideMesh.position.set(x, Tile.stepHeight / 2, z);
    sideMesh.rotation.y = Math.PI / 2;
    sideMesh.userObject = userObject;
    //sideMesh.position.y = (this.height * Tile.stepHeight) / 2
    hex.add(sideMesh);
    var topMesh = new THREE.Mesh(topGeom, surfaceMaterial);
    topMesh.position.set(x, Tile.stepHeight, z);
    //topMesh.rotation.set(Math.PI / 2, 0, Math.PI / 2);
    topMesh.rotation.x = -Math.PI / 2;
    topMesh.userObject = userObject;
    //topMesh.rotation.y = Math.PI / 2;
    //topMesh.rotation.z = -Math.PI / 2;
    hex.add(topMesh);
    var botMesh = new THREE.Mesh(topGeom, surfaceMaterial);
    //topMesh.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
    botMesh.position.set(x, 0, z);
    botMesh.rotation.x = Math.PI / 2;
    botMesh.userObject = userObject;
    //botMesh.rotation.y = Math.PI / 2;
    //botMesh.rotation.z = -Math.PI / 2;
    hex.add(botMesh);

    scene.remove(this.graphicObject);
    this.graphicObject = hex;
	scene.add(hex);
}

Tile.drag = function (event) {
	if (Tile.draggingTile === null) { return; }
	var dY = (Tile.draggingTile.startLocation.y - event.clientY) / Tile.stepHeight;
	Tile.draggingTile.height = Math.round(Math.max(Tile.draggingTile.baseHeight + dY, 1));
	Tile.draggingTile.graphicObject.scale.y = Tile.draggingTile.height;
}

Tile.endDrag = function () {
	if (Tile.draggingTile === null) { return; }
	Tile.draggingTile.baseHeight = null;
	Tile.draggingTile = null;
}
Tile.stepHeight = 10;
Tile.draggingTile = null;