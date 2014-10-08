var colors = [0x00CC00, 0xCC0000, 0x0000CC, 0xCCCC00, 0xCC00CC, 0x00CCCC, 0xCCCCCC, 0x333333];

var hexMaterial = [{
  name: 'Green',
  color: '#00CC00',
  material: new THREE.MeshLambertMaterial({
      color: colors[0],
    })
  },
  {
    name: 'Red',
    color: '#CC0000',
    material: new THREE.MeshLambertMaterial({
        color: colors[1],
      })
  },
  {
    name: 'Blue',
    color: '#0000CC',
    material: new THREE.MeshLambertMaterial({
      color: colors[2]
    })
  },
  {
    name: 'Yellow',
    color: '#CCCC00',
    material: new THREE.MeshLambertMaterial({
      color: colors[3]
    })
  },
  {
    name: 'Pink',
    color: '#CC00CC',
    material: new THREE.MeshLambertMaterial({
      color: colors[4]
    })
  },
  {
    name: 'Cyan',
    color: '#00CCCC',
    material: new THREE.MeshLambertMaterial(
    {
      color: colors[5]
    })
  },
  {
    name: 'black',
    color: '#333333',
    material: new THREE.MeshLambertMaterial(
    {
      color: colors[7]
    })
  },
  {
    name: 'tex',
    type: 'Texture',
    color: '#ff6600',
    material: THREE.ImageUtils.loadTexture('assets/textures/UV_Grid_Sm.jpg'),
  },
  {
    name: 'grass',
    type: 'Texture',
    color: '#00ff00',
    material: THREE.ImageUtils.loadTexture('assets/textures/grass.jpg'),
  }
  ];


  var Materials = {};
  Materials.defaultTile = hexMaterial[8];
  Materials.colors = hexMaterial;

var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {

  console.log( item, loaded, total );

};

  Materials.getMaterial = function (id) {
    if (typeof(id) === "object") {
      return id;
    }
    if (isNaN(id)) {
      for (var i = 0; i < Materials.colors.length; i++) {
        if (Materials.colors[i].name === id) {
          return Materials.colors[i].material;
        }
      }
    } else if (id < Materials.colors.length) {
      return Materials.colors[id].material;
    }
  }

var texture = THREE.ImageUtils.loadTexture('assets/textures/UV_Grid_Sm.jpg');// new THREE.Texture();

var loader = new THREE.ImageLoader( manager );
loader.load( 'assets/textures/grass.jpg', function ( image ) {

  texture.image = image;
  texture.needsUpdate = true;
  Materials.colors.push({
    name: 'Grass',
    color: '#009900',
    material: texture,
    type: 'Texture'
  })
  //updatePalette();
}

);