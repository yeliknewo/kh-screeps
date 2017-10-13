function buildRoad(config, room, pos1, pos2) {
    let data = PathFinder.search(pos1, {pos: pos2, range: 1}, {
        swampCost: 1
    });
    _.forEach(data.path, function(tile) {
        config.queue.push({
            x: tile.x,
            y: tile.y,
            structureType: STRUCTURE_ROAD
        });
    });
}

// scans an area
var scan = function(pos, radius) {
    let room = Game.rooms[pos.roomName];
    let x = pos.x;
    let y = pos.y;
    let tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1);
    Object.keys(tiles).forEach( (key) => {

    });
}

module.exports = {
    buildRoad,
    scan
};
