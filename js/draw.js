var colors = [0x00CC00, 0xCC0000, 0x0000CC, 0xCCCC00, 0xCC00CC, 0x00CCCC, 0xCCCCCC, 0x333333];
var renderer;
var projector;
var camera;
var scene;

var radius = 2,
    segments = 16,
    rings = 16;
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

function initScene () {
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
	camera.position.set(0, 400, 200);
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
	  controls.update();
	  requestAnimationFrame( animate );
	  render();
	}
	for (var i = 0; i < hexWidth; i++) {
		for (var j = 0; j < hexHeight; j++) {
			var height = map[i][j].height
			var hex = new THREE.Mesh (
				new THREE.CylinderGeometry(10, 10, height, 6, 1, false),
				hexMaterial[ map[i][j].material]);
	    hex.castShadow = true;
	    hex.receiveShadow = true;
			var x = -75 + 15 * i + (j % 2 == 0 ? 0 : 0),
				y = 0 +  map[i][j].height / 2,
				z = 90 - 17.2 * j - (i % 2 == 0 ? 0 : 8.6);
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
	  hexMaterial[pieces[i].team + 1]);
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
	  scene.add(piece);
	}
	animate();

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

