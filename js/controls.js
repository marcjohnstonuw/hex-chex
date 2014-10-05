var mouse = new THREE.Vector2();
var controls;
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


  var intersects = raycaster.intersectObjects( scene.children );

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

  if ( intersects.length > 0 ) {
    clickObject(intersects[0].object);
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

function resetControls () {
  controls.enabled = false;
  TERRAFORM = false;
  $(renderer.domElement).off('mousedown');
  $(renderer.domElement).off('mousemove');
  $(renderer.domElement).off('mouseup');
}

function initCameraControls() {
  controls.enabled = true;
  $(renderer.domElement).on('mousedown', onDocumentMouseDown);
  $(renderer.domElement).on('mousemove', onDocumentMouseMove);
  $(renderer.domElement).on('mouseup', onDocumentMouseUp);
}

function initTerraform() {
  TERRAFORM = true;
}
