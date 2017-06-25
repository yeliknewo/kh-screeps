function buildRoad(config, room, pos1, pos2) {
    let data = PathFinder.search(pos1, {pos: pos2, range: 1}, {
        swampCost: 1
    });
    // console.log('c4');
    _.forEach(data.path, function(tile) {
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