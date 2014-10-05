function Tile (attrs) {
	this.x = attrs.x;
	this.y = attrs.y;

	this.height = attrs.height || 4;
	this.material = attrs.material;

	this.beginDragTile = function (event) {
		this.baseHeight = this.height;
		this.startLocation = {x: event.clientX, y: event.clientY};
		Tile.draggingTile = this;
	}
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