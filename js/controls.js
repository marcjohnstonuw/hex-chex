var mouse = new THREE.Vector2();
var controls;
var CONTROL_MODE;
var SELECTED_COLOR = 0;
var clickLocation = {};
function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  switch (CONTROL_MODE) {
    case 'camera':
      break;
    case 'terraform':
      Tile.drag(event);
      break;
  }
/*

  var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
  projector.unprojectVector( vector, camera );

  var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  var intersects = raycaster.intersectObjects( scene.children );
  if ( intersects.length > 0 ) {
    container.style.cursor = 'pointer';
  } else {
    container.style.cursor = 'auto';
  }
  */
}
function onDocumentMouseDown( event ) {

  event.preventDefault();
  clickLocation = {x: event.clientX, y: event.clientY};

  var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
  projector.unprojectVector( vector, camera );

  var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  var intersects = raycaster.intersectObjects( scene.children );

  if ( intersects.length > 0 ) {
    clickObject(intersects[0].object, event);
  }
}

function onDocumentMouseUp( event ) {
  event.preventDefault();
  controls.enabled = true;
  switch (CONTROL_MODE) {
    case 'camera':
      if ( INTERSECTED ) {
        plane.position.copy( INTERSECTED.position );
        SELECTED = null;
      }
      break;
    case 'terraform':
      Tile.endDrag();
      break;
  }
  container.style.cursor = 'auto';
}

function resetControls () {
  controls.enabled = false;
  TERRAFORM = false;
//  $(renderer.domElement).off('mousedown');
//  $(renderer.domElement).off('mousemove');
//  $(renderer.domElement).off('mouseup');
}

function initCameraControls() {
  controls.enabled = true;
  CONTROL_MODE = 'camera';
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
  //$(renderer.domElement).on('mousedown', onDocumentMouseDown);
  //$(renderer.domElement).on('mousemove', onDocumentMouseMove);
  //$(renderer.domElement).on('mouseup', onDocumentMouseUp);
}

function initTerraformControls() {
  TERRAFORM = true;
  CONTROL_MODE = 'terraform';
}

function initPaintControls() {
  CONTROL_MODE = 'paint';
}

function paintTile(tile) {
  tile.paint(Materials.colors[SELECTED_COLOR]);
  //tile.graphicObject.material = Materials.colors[SELECTED_COLOR].material
  console.log(tile.graphicObject);
}

function clickObject(obj, event) {
  SELECTED = obj;
  if (SELECTED.gameType === 'Tile') {
    var mapObj = map.tiles[SELECTED.mapX][SELECTED.mapY];
    if (CONTROL_MODE === 'terraform') {
      mapObj.beginDragTile(event);
    } else if (CONTROL_MODE === 'paint') {
      paintTile(mapObj);
    }
    controls.enabled = false;
    if(CURRENT_PIECE !== null && mapObj.selected) {
      jumpit(CURRENT_PIECE, {x: pieces[CURRENT_PIECE.pieceIndex].x, y: pieces[CURRENT_PIECE.pieceIndex].y}, {x: SELECTED.mapX, y: SELECTED.mapY})
    }
  } else if (SELECTED.gameType === 'Piece') {
    if (SELECTED.team !== CURRENT_MOVE) {
      var piece = pieces[SELECTED.pieceIndex];
      var mapObj = map[piece.x][piece.y];
      if (mapObj.selected) {
        jumpit(CURRENT_PIECE, {x: pieces[CURRENT_PIECE.pieceIndex].x, y: pieces[CURRENT_PIECE.pieceIndex].y}, {x: piece.x, y: piece.y})
        return;
      }
    }
    if (MOVE_CHAIN) {
      return;
    }
    if (SELECTED.team === CURRENT_MOVE) {
      var piece = pieces[SELECTED.pieceIndex];
      if (!CAN_CAPTURE || piece.canCapture) {
        unselectAll();
        CURRENT_PIECE = SELECTED;
        highlightMoves(piece, 2);
      }      
    }
  }
}