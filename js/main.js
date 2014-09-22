var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var hexWidth = 30, hexHeight = 20;
var colors = [0x00CC00, 0xCC0000, 0x0000CC, 0xCCCC00, 0xCC00CC, 0x00CCCC, 0xCCCCCC, 0x333333]

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
var renderer = new THREE.WebGLRenderer();
var camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
camera.position.set(0, 400, 400);
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
      color: 0xCC0000
    });
var hexMaterial = [
  new THREE.MeshLambertMaterial(
    {
      color: colors[0]
    }),
  /*
  new THREE.MeshLambertMaterial(
    {
      color: colors[1]
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
*/
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
		var height = (Math.sin(i / 3.0) * 30) 
			+ (Math.pow(Math.cos((j - 5) / 3.0), 4) * 20)
			+ 40   //5 + (i + j) * 5;
		var hex = new THREE.Mesh (
			new THREE.CylinderGeometry(10, 10, height, 6, 1, false),
			hexMaterial[(i * hexWidth + j) % hexMaterial.length]);
		var x = -200 + 17.32 * i + (j % 2 == 0 ? 0 : 8.6),
			y = 0 + height / 2,
			z = 150 - 15 * j + (j % 2 == 0 ? 0 : 0);
		hex.position.set(x, y, z);
		scene.add(hex);
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

// draw!
function drawit () {
	renderer.render(scene, camera);
	setTimeout(function () {
		drawit();
	}, 500);
}
drawit();


