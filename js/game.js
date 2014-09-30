var hexWidth = 9, hexHeight = 8;
var NUM_TEAMS = 2;
var CURRENT_MOVE = 0;
var MOVE_CHAIN = false;
var CAN_CAPTURE = false;
var SELECTED, INTERSECTED, CURRENT_PIECE = null;

var map = new Array(hexWidth);
for (var i = 0; i < hexWidth; i++) {
  map[i] = new Array(hexHeight);
  for (var j = 0; j < hexHeight; j++) {
    var tile = {};
    tile.height = 
      //(Math.sin(i / 3.0) * 30) + 
      //(Math.pow(Math.cos((j - 5) / 3.0), 4) * 20) + 
      ((i % 2 == 0) ? 5 : 0) + 
      ((j % 2 == 0) ? 5 : 0) + 
      40;   //5 + (i + j) * 5;
    tile.height = Math.round(tile.height);
    tile.material = 0;
    tile.selected = false;
    map[i][j] = tile;
  }
}
var pieces = [
  {x: 0, y: 1, team: 0},
  {x: 1, y: 0, team: 0},
  {x: 2, y: 0, team: 0},
  {x: 3, y: 0, team: 0},
  {x: 4, y: 1, team: 0},
  {x: 5, y: 0, team: 0},
  {x: 6, y: 0, team: 0},
  {x: 7, y: 0, team: 0},
  {x: 8, y: 1, team: 0},
  {x: 0, y: 6, team: 1},
  {x: 1, y: 6, team: 1},
  {x: 2, y: 7, team: 1},
  {x: 3, y: 6, team: 1},
  {x: 4, y: 6, team: 1},
  {x: 5, y: 6, team: 1},
  {x: 6, y: 7, team: 1},
  {x: 7, y: 6, team: 1},
  {x: 8, y: 6, team: 1}
];

function jumpit(piece, from, to) {
  var nextTurn = takePiece(piece, from, to);
  pieces[piece.pieceIndex].x = to.x;
  pieces[piece.pieceIndex].y = to.y;
  checkPromotion(pieces[piece.pieceIndex], to);
  if (nextTurn) {
    nextMove();
  } else {
    chainMove(pieces[piece.pieceIndex])
  }
  checkCanCapture();
  var start = getPiecePosition(from.x, from.y);
  var end = getPiecePosition(to.x, to.y);
  var distance = getDistance(from, to); //3;//Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2));
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
}

function nextMove () {
  CURRENT_MOVE += 1;
  CURRENT_MOVE = CURRENT_MOVE % NUM_TEAMS;
  MOVE_CHAIN = false;
  unselectAll();
}

function clickObject(obj) {
	SELECTED = intersects[ 0 ].object;
	if (SELECTED.gameType === 'Tile') {
	  controls.enabled = false;
	  var mapObj = map[SELECTED.mapX][SELECTED.mapY];
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