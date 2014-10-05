function getPiecePosition (map_x, map_y) {
  var x = -75 + 15 * map_x + (map_y % 2 == 0 ? 0 : 0),
    y = 0 + map[map_x][map_y].height + 2,
    z = 90 - 17.2 * map_y - (map_x % 2 == 0 ? 0 : 8.6);
  return { x: x, y: y, z: z};
}

function setPiecePosition (piece, map_x, map_y) {
  var pos = getPiecePosition(map_x, map_y);
  piece.position.set(pos.x, pos.y, pos.z);
  pieces[piece.pieceIndex].x = map_x;
  pieces[piece.pieceIndex].y = map_y;
}

function getRange(map_x, map_y, radius, mustTake) {
  var ret = [];
  var enemyPositions = [];
  if (mustTake) {
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].team != CURRENT_MOVE && !pieces[i].taken) {
        enemyPositions.push([pieces[i].x, pieces[i].y]);
      }
    }
  }
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
  if (mustTake) {
    ret = intersectTiles(ret, enemyPositions);
    ret = addJumps(ret, map_x, map_y);
  }
  return ret;
}

function addJumps (moves, x, y) {
  for (var i = 0; i < moves.length; i++) {
    if (moves[i][0] === x && Math.abs(moves[i][1] - y) === 1 && y + 2 * (moves[i][1] - y) >= 0 && y + 2 * (moves[i][1] - y) < hexHeight) {
      moves.push([x, y + 2 * (moves[i][1] - y)])
    }
    if (x % 2 === 0) {
      if (Math.abs(moves[i][0] - x) === 1 && x + 2 * (moves[i][0] - x) >= 0 && x + 2 * (moves[i][0] - x) < hexWidth && y + 1 < hexHeight) {
        if (moves[i][1] === y) {
          moves.push([x + 2 * (moves[i][0] - x), y + 1]);
        } else if (moves[i][1] === y - 1) {
          moves.push([x + 2 * (moves[i][0] - x), y - 1]);
        }
      }
    } else {
      if (Math.abs(moves[i][0] - x) === 1 && x + 2 * (moves[i][0] - x) >= 0 && x + 2 * (moves[i][0] - x) < hexWidth && y + 1 < hexHeight) {
        if (moves[i][1] === y + 1) {
          moves.push([x + 2 * (moves[i][0] - x), y + 1]);
        } else if (moves[i][1] === y) {
          moves.push([x + 2 * (moves[i][0] - x), y - 1]);
        }
      }
    }
  }
  return moves;
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

function getForwardMoves (map_x, map_y, radius, mustTake) {
  var ret = [];
  var enemyPositions = [];
  if (mustTake) {
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].team != CURRENT_MOVE && !pieces[i].taken) {
        enemyPositions.push([pieces[i].x, pieces[i].y]);
      }
    }
  }

  for (var i = -radius; i <= radius; i++) {
    var y_offset = Math.floor(Math.abs(i) / 2);
    if (map_x % 2 == 1) {
      y_offset += (Math.abs(i) % 2 == 1) ? 1 : 0;
    }
    for (var j = 0 + y_offset; j <= (radius - Math.abs(i)) + y_offset; j++) {
      if (i + map_x >= 0 && i + map_x < hexWidth && j + map_y >= 0 && j + map_y < hexHeight && !(i == 0 && j == 0)) {
        var xpos = i + map_x;
        var ypos = j + map_y;
        var add = true
        for (var p = 0; p < pieces.length; p++) {
          if (!(xpos != pieces[p].x || ypos != pieces[p].y || pieces[p].team != CURRENT_MOVE || pieces[p].taken === true)) {
            add = false;
          }
        }
        if (add){
          ret.push([xpos, ypos]);
        }
      }
    }
  }
  if (mustTake) {
    ret = intersectTiles(ret, enemyPositions);
    ret = addJumps(ret, map_x, map_y);
  }

  return ret;
}

function getBackwardMoves (map_x, map_y, radius, mustTake) {
  var ret = [];
  var enemyPositions = [];
  if (!!mustTake) {
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].team != CURRENT_MOVE && !pieces[i].taken) {
        enemyPositions.push([pieces[i].x, pieces[i].y]);
      }
    }
  }

  for (var i = -radius; i <= radius; i++) {
    var y_offset = Math.ceil(Math.abs(i) / 2);
    if (map_x % 2 == 1) {
      y_offset -= (Math.abs(i) % 2 == 1) ? 1 : 0;
    }
    for (var j = 0 - y_offset; j >= -(radius - Math.abs(i)) - y_offset; j--) {
      if (i + map_x >= 0 && i + map_x < hexWidth && j + map_y >= 0 && j + map_y < hexHeight && !(i == 0 && j == 0)) {
        var xpos = i + map_x;
        var ypos = j + map_y;
        var add = true
        for (var p = 0; p < pieces.length; p++) {
          if (!(xpos != pieces[p].x || ypos != pieces[p].y || pieces[p].team != CURRENT_MOVE || pieces[p].taken === true)) {
            add = false;
          }
        }
        if (add){
          ret.push([xpos, ypos]);
        }
      }
    }
  }
  if (!!mustTake) {
    ret = intersectTiles(ret, enemyPositions);
    ret = addJumps(ret, map_x, map_y);
  }

  return ret;
}

function unselectAll (keepPiece) {
  if (!!keepPiece) {
    CURRENT_PIECE = null;
  }
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

function checkPromotion(piece, to) {
  if (piece.team === 0 && to.y === hexHeight - 1) {
    piece.getMoves = getRange;
  } else if (piece.team === 1 && to.y === 0) {
    piece.getMoves = getRange;
  }
}

function takePiece(piece, from, to) {
  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].x === to.x && pieces[i].y === to.y && pieces[i] != piece.team) {
      pieces[i].taken = true;
      var sceneObj = scene.getObjectByName(pieces[i].name);
      scene.remove(sceneObj);  
    }
  }
  //jumped piece?
  var jump_x, jump_y;
  if (from.x === to.x && Math.abs(from.y - to.y) === 2) {
    jump_x = from.x;
    jump_y = (to.y + from.y) / 2;
  } else if (Math.abs(from.x - to.x) === 2) {
    jump_x = (to.x + from.x) / 2;
    if (from.x % 2 === 0) {
      jump_y = to.y > from.y ? from.y : from.y - 1;
    } else {
      jump_y = to.y > from.y ? from.y + 1 : from.y;
    }
  }
  if (jump_x !== undefined) {
    for (var i = 0; i < pieces.length; i++) {
      if (pieces[i].x === jump_x && pieces[i].y === jump_y && pieces[i] != piece.team) {
        pieces[i].taken = true;
        checkCanCapture();
        var sceneObj = scene.getObjectByName(pieces[i].name);
        scene.remove(sceneObj);
        return false;
      }
    }
  }
  return true;
}

function checkCanCapture () {
  CAN_CAPTURE = false;
  var enemyPositions = [];
  for (var i = 0; i < pieces.length; i++) {
    pieces[i].canCapture = false;
    if (pieces[i].team != CURRENT_MOVE && !pieces[i].taken) {
      enemyPositions.push([pieces[i].x, pieces[i].y]);
    }
  }

  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].team === CURRENT_MOVE && !pieces[i].taken) {
      var moves = pieces[i].getMoves(pieces[i].x, pieces[i].y, pieces[i].range, pieces[i].canCapture);
      var intersection = intersectTiles(enemyPositions, moves).length > 0;
      pieces[i].canCapture = intersection;
      if (intersection) {
        CAN_CAPTURE = true;
      }
    }
  }
}

function intersectTiles(a, b) {
  var ret = [];
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      if (a[i][0] === b[j][0] && a[i][1] === b[j][1]) {
        ret.push(a[i]);
      }
    }
  }
  return ret;
}

function highlightMoves (piece) {
  var neighbours = piece.getMoves(piece.x, piece.y, piece.range, piece.canCapture);//getRange(piece.x, piece.y, 2);//getNeighbours(piece.x, piece.y, 1);
  neighbours.forEach(function (el) {
    map[el[0]][el[1]].selected = true;
    map[el[0]][el[1]].graphicObject.material = hexMaterial[7]; 
  })
}

function chainMove(piece) {
  unselectAll();
  MOVE_CHAIN = true;
  highlightMoves(piece);
}


//save this shit, y-coordinate for jumps
//(y1 + (9.8 * x1 * x1) - ((y0 * x1) / x0) - (9.8 * x1 * x0)) / (1 - (x1 / x0))