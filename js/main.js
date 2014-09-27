var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var hexWidth = 25, hexHeight = 25, pieces = 5;
var colors = [0x00CC00, 0xCC0000, 0x0000CC, 0xCCCC00, 0xCC00CC, 0x00CCCC, 0xCCCCCC, 0x333333]

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;
var SELECTED, INTERSECTED, CURRENT_PIECE = null;
var controls;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

controls = new THREE.TrackballControls( camera );
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

var projector = new THREE.Projector();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xCCCCCC } ) );
plane.rotation.x = -Math.PI/2;
plane.position.set(0, 0, 0);
plane.name = "theplane";

var scene = new THREE.Scene();
var map = new Array(hexWidth);
for (var i = 0; i < hexWidth; i++) {
  map[i] = new Array(hexHeight);
  for (var j = 0; j < hexHeight; j++) {
    var tile = {};
    tile.height = (Math.sin(i / 3.0) * 30) 
      + (Math.pow(Math.cos((j - 5) / 3.0), 4) * 20)
      + 40;   //5 + (i + j) * 5;
    tile.height = Math.round(tile.height);
    tile.material = 0;
    tile.selected = false;
    map[i][j] = tile;
  }
}
var pieces = [
  {x: 2, y: 2},
  {x: 5, y: 2},
  {x: 12, y: 6},
  {x: 9, y: 12},
  {x: 4, y: 22},
]
var objects = [];

// add the camera to the scene
scene.add(camera);
scene.add(plane);

// the camera starts at 0,0,0
// so pull it back
camera.position.set(0, 500, 500);
camera.lookAt(scene.position);	

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// set up the sphere vars
var radius = 2,
    segments = 16,
    rings = 16;

// create the sphere's material
var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000,
       transparent: true,
    });
var hexMaterial = [
  new THREE.MeshLambertMaterial(
    {
      color: colors[0],
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[1],
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[2]
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[3]
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[4]
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[5]
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[6]
    }),
  new THREE.MeshLambertMaterial(
    {
      color: colors[7]
    }),
  ];

// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
var sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    radius,
    segments,
    rings),

  sphereMaterial);

// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight
for (var i = 0; i < hexWidth; i++) {
	for (var j = 0; j < hexHeight; j++) {
		var height = map[i][j].height
		var hex = new THREE.Mesh (
			new THREE.CylinderGeometry(10, 10, height, 6, 1, false),
			hexMaterial[ map[i][j].material]);
		var x = -200 + 15 * i + (j % 2 == 0 ? 0 : 0),
			y = 0 +  map[i][j].height / 2,
			z = 150 - 17.2 * j - (i % 2 == 0 ? 0 : 8.6);
		hex.position.set(x, y, z);
    hex.rotation.y = Math.PI / 2;
    hex.name = "hex X:" + i + " Z:" + j;
    hex.gameType = "Tile";
    hex.mapX = i;
    hex.mapY = j;
    map[i][j].graphicObject = hex;
		scene.add(hex);
    objects.push(hex);
	}
}
for (var i = 0; i < pieces.length; i++) {
  var piece = new THREE.Mesh (
    new THREE.CylinderGeometry(6, 6, 4, 36, 1, false),
  hexMaterial[1]);
  piece.name = "piece" + i;
  piece.gameType = "Piece";
  piece.pieceIndex = i;
  var map_x = pieces[i].x
  var map_y = pieces[i].y
  setPiecePosition(piece, map_x, map_y)
  scene.add(piece);
}

// create a point light
var pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = -200;
pointLight.position.y = 200;
pointLight.position.z = 200;

// add to the scene
scene.add(pointLight);

// set the geometry to dynamic
// so that it allow updates
sphere.geometry.dynamic = true;

// changes to the vertices
sphere.geometry.verticesNeedUpdate = true;

// changes to the normals
sphere.geometry.normalsNeedUpdate = true;



function render() {
  renderer.render( scene, camera );
}
function animate() {
  controls.update();
  requestAnimationFrame( animate );
  render();
}
animate();





function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
  projector.unprojectVector( vector, camera );

  var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );


  if ( SELECTED ) {

    return;

  }


  var intersects = raycaster.intersectObjects( objects );

  if ( intersects.length > 0 ) {
    container.style.cursor = 'pointer';

  } else {

    container.style.cursor = 'auto';

  }
}
function onDocumentMouseDown( event ) {

  event.preventDefault();

  var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
  projector.unprojectVector( vector, camera );

  var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  var intersects = raycaster.intersectObjects( scene.children );
  console.log('clicky');

  if ( intersects.length > 0 ) {


    SELECTED = intersects[ 0 ].object;
    if (SELECTED.gameType === 'Tile') {
      controls.enabled = false;
      var mapObj = map[SELECTED.mapX][SELECTED.mapY]
      if(CURRENT_PIECE !== null && mapObj.selected) {
        //move the piece!
        //setPiecePosition (CURRENT_PIECE, SELECTED.mapX, SELECTED.mapY)
        jumpit(CURRENT_PIECE, {x: pieces[CURRENT_PIECE.pieceIndex].x, y: pieces[CURRENT_PIECE.pieceIndex].y}, {x: SELECTED.mapX, y: SELECTED.mapY})
        unselectAll();
      } else {
        unselectAll();
        SELECTED.material = hexMaterial[7]; 
        mapObj.selected = true;
      }
      console.log('match:' + SELECTED.name);
      intersects.forEach(function (thing) { console.log(thing.object.name + thing.distance) })

      var intersects = raycaster.intersectObject( plane );
      offset.copy( intersects[ 0 ].point ).sub( plane.position );
    } else if (SELECTED.gameType === 'Piece') {
      unselectAll();
      CURRENT_PIECE = SELECTED;
      var piece = pieces[SELECTED.pieceIndex];
      var neighbours = getRange(piece.x, piece.y, 4);//getNeighbours(piece.x, piece.y, 1);
      neighbours.forEach(function (el) {
        map[el[0]][el[1]].selected = true;
        map[el[0]][el[1]].graphicObject.material = hexMaterial[7]; 
      })
    }

    //container.style.cursor = 'move';

  }

}

function onDocumentMouseUp( event ) {
  event.preventDefault();
  controls.enabled = true;
  if ( INTERSECTED ) {
    plane.position.copy( INTERSECTED.position );
    SELECTED = null;
  }
  container.style.cursor = 'auto';
}

renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

function getPiecePosition (map_x, map_y) {
  var x = -200 + 15 * map_x + (map_y % 2 == 0 ? 0 : 0),
    y = 0 + map[map_x][map_y].height + 2,
    z = 150 - 17.2 * map_y - (map_x % 2 == 0 ? 0 : 8.6);
  return { x: x, y: y, z: z};
}

function setPiecePosition (piece, map_x, map_y) {
  var pos = getPiecePosition(map_x, map_y);
  piece.position.set(pos.x, pos.y, pos.z);
  pieces[piece.pieceIndex].x = map_x;
  pieces[piece.pieceIndex].y = map_y;
}

function getRange(map_x, map_y, radius) {
  var ret = [];
  if (map_x % 2 === 1) {
    for (var i = -radius; i <= radius; i++) {
      for (var j = (-radius + Math.ceil(0.5 * Math.abs(i))); j <= (radius - Math.floor(0.5 * Math.abs(i))); j++) {
        if (map_x + i >= 0 && map_x + i < hexWidth && map_y + j >= 0 && map_y + j < hexHeight) {
          ret.push([map_x + i, map_y + j]);
        } 
      }
    }
  } else {
    for (var i = -radius; i <= radius; i++) {
      for (var j = (-radius + Math.floor(0.5 * Math.abs(i))); j <= (radius - Math.ceil(0.5 * Math.abs(i))); j++) {
        if (map_x + i >= 0 && map_x + i < hexWidth && map_y + j >= 0 && map_y + j < hexHeight) {
          ret.push([map_x + i, map_y + j]);
        } 
      }
    }
  }
  return ret;
}

function getNeighbours(map_x, map_y, radius, self) {
  if (self === undefined) self = false;
  var ret = [];
  if (self) {
    ret.push([map_x, map_y]);
  }
  if (map_x % 2 === 0) {
    if (map_y + 1 < hexHeight) {
      ret.push([map_x, map_y + 1]);
    }
    if (map_y - 1 >= 0) {
     ret.push([map_x, map_y - 1]); 
    }
    if (map_x - 1 >= 0) {
      ret.push([map_x-1, map_y]);
      if (map_y - 1 >= 0) {
       ret.push([map_x-1, map_y - 1]); 
      }
    }
    if (map_x + 1 < hexWidth) {
      ret.push([map_x+1, map_y]);
      if (map_y - 1 >= 0) {
       ret.push([map_x+1, map_y - 1]); 
      }
    }
  } else {
    if (map_y + 1 < hexHeight) {
      ret.push([map_x, map_y + 1]);
    }
    if (map_y - 1 >= 0) {
     ret.push([map_x, map_y - 1]); 
    }
    if (map_x - 1 >= 0) {
      ret.push([map_x-1, map_y]);
      if (map_y + 1 < hexHeight) {
       ret.push([map_x-1, map_y + 1]); 
      }
    }
    if (map_x + 1 < hexWidth) {
      ret.push([map_x+1, map_y]);
      if (map_y + 1 < hexHeight) {
       ret.push([map_x+1, map_y + 1]); 
      }
    }
  }
  return ret;
}

function unselectAll () {
  CURRENT_PIECE = null;
  for (var i = 0; i < hexWidth; i++) {
    for (var j = 0; j < hexHeight; j++) {
      if (map[i][j].selected) unselect(i, j);
    }
  }
}

function unselect(x, y) {
  map[x][y].selected = false;
  map[x][y].graphicObject.material = hexMaterial[0];
}

function getDistance (p1, p2) {
  var ret = Math.abs(p1.y - p2.y);
  if (p1.x % 2 === 0) {
    if (p2.y >= p1.y) {
      ret += Math.abs(p1.x - p2.x);
    } else if (p1.x != p2.x) {
      ret += Math.abs(p1.x - p2.x) - 1;
    }
  }
  else {
    if (p2.y > p1.y && p1.x != p2.x) {
      ret += Math.abs(p1.x - p2.x) - 1;
    } else {
      ret += Math.abs(p1.x - p2.x);
    }
  }
  return ret;
}

function jumpit(piece, from, to) {
  var start = getPiecePosition(from.x, from.y);
  var end = getPiecePosition(to.x, to.y);
  var distance = getDistance(from, to); //3;//Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2));
  console.log('distance :' + distance );//+ 'delta x' + (end.x - start.x) + 'delta z' + (end.z - start.z)
  var x0 = 1;
  var y0 = map[from.x][from.y].height + 2;
  var x1 = 1 + distance;
  var y1 = map[to.x][to.y].height + 2;

  var c = (y1 + (9.8 * x1 * x1) - ((y0 * x1) / x0) - (9.8 * x1 * x0)) / (1 - (x1 / x0));
  var b = (y0 + (9.8 * x0 * x0) - c) / x0;

  var startX = start.x;
  var startY = start.y;
  var startZ = start.z;

  var endX = end.x;
  var endY = end.y;
  var endZ = end.z;

  slideit(piece, start, end, distance, 0, 60, b, c);
  pieces[piece.pieceIndex].x = to.x;
  pieces[piece.pieceIndex].y = to.y;
}

function slideit(piece, start, end, distance, frames, total, b, c) {
  if (frames > total) {
    return;
  } else {
    var x = 1 + (frames / total) * distance;
    piece.position.set(
      start.x + (end.x - start.x) * (frames / total),
      (-9.8 * x * x) + b * x + c,
      start.z + (end.z - start.z) * (frames / total)
    );
    setTimeout(function () {
      slideit(piece, start, end, distance, frames + 1, total, b, c);
    }, 17)
  }
}

//save this shit, y-coordinate for jumps
//(y1 + (9.8 * x1 * x1) - ((y0 * x1) / x0) - (9.8 * x1 * x0)) / (1 - (x1 / x0))