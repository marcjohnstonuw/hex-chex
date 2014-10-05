var hexWidth = 9, hexHeight = 8;
var NUM_TEAMS = 2;
var CURRENT_MOVE = 0;
var MOVE_CHAIN = false;
var CAN_CAPTURE = false;
var SELECTED, INTERSECTED, CURRENT_PIECE = null;


var map = new Map({width: hexWidth, height: hexHeight})

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
  var y0 = map.tiles[from.x][from.y].height + 2;
  var x1 = 1 + distance;
  var y1 = map.tiles[to.x][to.y].height + 2;

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