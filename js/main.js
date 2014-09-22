var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var hexWidth = 30, hexHeight = 20;
var colors = [0x00CC00, 0xCC0000, 0x0000CC, 0xCCCC00, 0xCC00CC, 0x00CCCC, 0xCCCCCC, 0x333333]

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;
var SELECTED, INTERSECTED;
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
    tile.material = 0;
    tile.selected = false;
    map[i][j] = tile;
  }
}
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
		var x = -200 + 17.42 * i + (j % 2 == 0 ? 0 : 8.6),
			y = 0 +  map[i][j].height / 2,
			z = 150 - 15.1 * j + (j % 2 == 0 ? 0 : 0);
		hex.position.set(x, y, z);
    hex.name = "hex X:" + i + " Z:" + j;
    hex.mapX = i;
    hex.mapY = j;
		scene.add(hex);
    objects.push(hex);
	}
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

  var intersects = raycaster.intersectObjects( objects );
  console.log('clicky');

  if ( intersects.length > 0 ) {

    controls.enabled = false;

    SELECTED = intersects[ 0 ].object;
    var mapObj = map[SELECTED.mapX][SELECTED.mapY]
    if(mapObj.selected) {
      SELECTED.material = hexMaterial[mapObj.material];
      mapObj.selected = false;
    } else {
      SELECTED.material = hexMaterial[7]; 
      mapObj.selected = true;
    }
    console.log('match:' + SELECTED.name);
    intersects.forEach(function (thing) { console.log(thing.object.name + thing.distance) })

    var intersects = raycaster.intersectObject( plane );
    offset.copy( intersects[ 0 ].point ).sub( plane.position );

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
