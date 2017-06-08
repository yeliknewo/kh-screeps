function buildRoad(config, room, pos1, pos2) {
    let path = room.findPath(pos1, pos2);
    // console.log('c4');
    _.forEach(path, function(tile) {
        // console.log('c5');
        config.queue.push({
            x: tile.x,
            y: tile.y,
            structureType: STRUCTURE_ROAD
        });
        // console.log('c6');
    });
}

module.exports = {
    buildRoad
}
