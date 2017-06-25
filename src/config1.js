var util = require('util')
var buildRoad = util.buildRoad;
var cnst = require('targetPoolConstants');

//generates config for a lvl 1 room
var config1 = function(room) {
    // console.log('c1');
    let config = {};
    // console.log('c2');
    //generate a construction site queue
    config.queue = []; //build queue
    // console.log('c2');
    let spawn = room.find(FIND_STRUCTURES, {
        filter: (struct) => {
            return (struct.structureType == STRUCTURE_SPAWN)
        }
    })[0];
    // console.log('c3');

    //the order objects are added to config.creeps (also config.queue) is the order those creeps are spawned in
    // console.log('c7');
    config.creeps = {};
    // console.log('c8');
    //calculates the maximum number of harvesters
    let harvester_max = 0;
    // console.log('c9');
    let sources = room.find(FIND_SOURCES);
    // console.log('c10');
    _.forEach(sources, function(source) {
        // console.log('c11');
        let x = source.pos.x;
        // console.log('c12');
        let y = source.pos.y;
        // console.log('c13');
        let tiles = room.lookForAtArea(LOOK_TERRAIN, y - 1, x - 1,
            y + 1, x + 1, true);
        // console.log('c14');
        let spaces = _.filter(tiles, (tile) => {
            return tile.terrain !==
                "wall" && (tile.x != source.pos.x || tile.y !=
                    source.pos.y);
        });
        // console.log('c15');
        harvester_max += spaces.length;
        // console.log('c16');
        let middle_space = spaces[0];
        // console.log('c17');
        if (middle_space) {
            config.queue.push({
                x: middle_space.x,
                y: middle_space.y,
                structureType: STRUCTURE_CONTAINER
            });
        }

        buildRoad(config, room, spawn.pos, source.pos);
        // console.log('c18');
    });

    buildRoad(config, room, spawn.pos, room.controller.pos);

    // harvester_max = 10;

    // console.log('c19');
    config.creeps.harvester = {
        body: [WORK, CARRY, MOVE, MOVE],
        max: harvester_max,
        memory: {
            kin: 'harvester'
        }
    };
    // console.log('c20');

    //harvest work to upgrade work is 2/1
    let upgrader_max = Math.max(1, Math.floor(harvester_max * 0.3)); //TODO make this dynamic
    config.creeps.upgrader = {
        body: [WORK, CARRY, MOVE, MOVE],
        max: upgrader_max,
        memory: {
            kin: 'upgrader'
        }
    };

    //harvest work to build work is 5/2
    let builder_max = Math.max(1, Math.floor((harvester_max - upgrader_max) *
        0.5));
    config.creeps.builder = {
        body: [WORK, CARRY, MOVE, MOVE],
        max: builder_max,
        memory: {
            kin: 'builder'
        }
    };

    room.memory.config = config;
}

module.exports = config1;
