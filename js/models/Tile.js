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
			this.createAddGraphicObject()
		} else {
			this.graphicObject.material = this.permanentMaterial = this.material = material.material;
		}
	}
}

Tile.prototype.createAddGraphicObject = function () {
	var hex = new THREE.Mesh (
		new THREE.CylinderGeometry(10, 10, Tile.stepHeight, 6, 1, false),
		this.permanentMaterial.material
	);
    hex.castShadow = true;
    hex.receiveShadow = true;
	var x = -75 + 15 * this.x + (this.y % 2 == 0 ? 0 : 0),
		y = 0 + Tile.stepHeight / 2,
		z = 90 - 17.2 * this.y - (this.x % 2 == 0 ? 0 : 8.6);
	hex.position.set(x, y, z);
	hex.scale.y = this.height;
    hex.rotation.y = Math.PI / 2;
    hex.name = "hex X:" + this.x + " Z:" + this.y;
    hex.gameType = "Tile";
    hex.mapX = this.x;
    hex.mapY = this.y;
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