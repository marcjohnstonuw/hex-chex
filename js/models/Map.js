function Map (attrs) {
	this.width = attrs.width || 8
	this.height = attrs.height || 8;
	this.tiles = [];

	for (var i = 0; i < this.width; i++) {
		this.tiles.push([]);
		for (var j = 0; j < this.height; j++) {
			this.tiles[i].push(new Tile({x: i, y: j, material: Materials.defaultTile}))
		}
	}
}