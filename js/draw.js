var renderer;
var projector;
var camera;
var scene;

var radius = 2,
    segments = 16,
    rings = 16;

function initScene () {
	var hexWidth = 9, hexHeight = 8;
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
	// set some camera attributes
	var VIEW_ANGLE = 45,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	var $container = $('#container');

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	camera =
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

	projector = new THREE.Projector();
	var offset = new THREE.Vector3();
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xCCCCCC } ) );
	plane.rotation.x = -Math.PI/2;
	plane.position.set(0, 0, 0);
	plane.name = "theplane";

	scene = new THREE.Scene();
	var objects = [];

	// add the camera to the scene
	scene.add(camera);
	scene.add(plane);

	// the camera starts at 0,0,0
	// so pull it back
	camera.position.set(0, 250, 300);
	camera.lookAt(scene.position);	

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFShadowMap;

	// attach the render-supplied DOM element
	$container.append(renderer.domElement);

	scene.add( new THREE.AmbientLight( 0x202020 ) );

	// create a point light
	var spotLight =
	  new THREE.SpotLight(0xFFFFFF, 1.5);
	  //pointLight.target = new THREE.object3d(0, 0, -50);

	// set its position
	spotLight.position.x = -150;
	spotLight.position.y = 150;
	spotLight.position.z = 150;
	spotLight.castShadow = true;

	spotLight.shadowCameraNear = 20;
	spotLight.shadowCameraFar = camera.far;
	spotLight.shadowCameraFov = 50;

	spotLight.shadowBias = -0.00022;
	spotLight.shadowDarkness = 0.5;

	spotLight.shadowMapWidth = 2048;
	spotLight.shadowMapHeight = 2048;

	// add to the scene
	scene.add(spotLight);

	function render() {
	  renderer.render( scene, camera );
	}
	function animate() {
	  animation.update(.1);
	  controls.update();
	  requestAnimationFrame( animate );
	  render();
	}

	map = new Map({width: hexWidth, height: hexHeight})

	for (var i = 0; i < pieces.length; i++) {
	  var piece = new THREE.Mesh (
	    new THREE.CylinderGeometry(6, 6, 4, 36, 1, false),
	  Materials.colors[pieces[i].team + 1].material);
	  piece.castShadow = true;
	  piece.receiveShadow = true;
	  piece.name = "piece" + i;
	  piece.gameType = "Piece";
	  piece.pieceIndex = i;
	  piece.position = {};
	  piece.team = pieces[i].team
	  pieces[i].range = 2;
	  pieces[i].piece = piece;
	  pieces[i].name = "piece" + i;
	  if (pieces[i].team === 0) {
	    pieces[i].getMoves = getForwardMoves;
	  } else {
	    pieces[i].getMoves = getBackwardMoves;
	  }
	  var map_x = pieces[i].x
	  var map_y = pieces[i].y
	  setPiecePosition(piece, map_x, map_y)
	  //scene.add(piece);
	}


var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {

  console.log( item, loaded, total );

};

var texture = new THREE.Texture();

var loader = new THREE.ImageLoader( manager );
loader.load( 'assets/textures/UV_Grid_Sm.jpg', function ( image ) {

  texture.image = image;
  texture.needsUpdate = true;

} );

// model

var loader = new THREE.OBJLoader( manager );
loader.load( 'assets/objects/sword.obj', function ( object ) {

  object.traverse( function ( child ) {

    if ( child instanceof THREE.Mesh ) {
	  //child.material = Materials.colors[3];
      child.material.map = texture;

    }

  } );

  object.position.y = 80;
  object.scale.set(30, 30, 30)
  scene.add( object );

} );

loader = new THREE.JSONLoader(); // init the loader util
// load the model and create everything
loader.load('assets/objects/linked.js', function (geometry, materials) {
  var mesh, material;

  // create a mesh
  mesh = new THREE.SkinnedMesh(
    geometry,
    new THREE.MeshFaceMaterial(materials)
  );

  // define materials collection
  materials = mesh.material.materials;

  // enable skinning
  for (var i = 0; i < materials.length; i++) {
    var mat = materials[i];

    mat.skinning = true;
  }
  mesh.position.y = 110;
  mesh.scale.set(10, 10, 10);

  //scene.add(mesh);

  // add animation data to the animation handler
  //THREE.AnimationHandler.add(mesh.geometry.animation);

  // create animation
  animation = new THREE.Animation(
    mesh,
    mesh.geometry.animations[0]
  );

  // play the anim
  animation.play();

  animate();
})

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

function getHexagon () {//THREE.CylinderGeometry(10, 10, Tile.stepHeight, 6, 1, false),
var coin_sides_geo = new THREE.CylinderGeometry( 10, 10, 15, 6, 1, true );
var coin_cap_geo = new THREE.Geometry();
var r = 10.0;
var sides = 6;
for (var i=0; i<sides; i++) {
var a = i * 1/sides * Math.PI * 2;
var z = Math.sin(a);
var x = Math.cos(a);
var a1 = (i+1) * 1/sides * Math.PI * 2;
var z1 = Math.sin(a1);
var x1 = Math.cos(a1);
coin_cap_geo.vertices.push(
new THREE.Vertex(new THREE.Vector3(0, 0, 0)),
new THREE.Vertex(new THREE.Vector3(x*r, 0, z*r)),
new THREE.Vertex(new THREE.Vector3(x1*r, 0, z1*r))
);
coin_cap_geo.faceVertexUvs[0].push([
new THREE.UV(0.5, 0.5),
new THREE.UV(x/2+0.5, z/2+0.5),
new THREE.UV(x1/2+0.5, z1/2+0.5)
]);
coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));
}
coin_cap_geo.computeCentroids();
coin_cap_geo.computeFaceNormals();

var coin_sides_texture =
THREE.ImageUtils.loadTexture("assets/textures/grass.jpg");
var coin_cap_texture =
THREE.ImageUtils.loadTexture("assets/textures/grass.jpg");

var coin_sides_mat =
new THREE.MeshLambertMaterial({map:coin_sides_texture});
var coin_sides =
new THREE.Mesh( coin_sides_geo, coin_sides_mat );

var coin_cap_mat = new THREE.MeshLambertMaterial({map:coin_cap_texture});
var coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
var coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
coin_cap_top.position.y = 50.5;
coin_cap_bottom.position.y = 49.5;
coin_cap_top.rotation.x = Math.PI;

var coin = new THREE.Object3D();
coin.add(coin_sides);
coin.add(coin_cap_top);
coin.add(coin_cap_bottom);
scene.add(coin)
}