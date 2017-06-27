var util = require('util')
var buildRoad = util.buildRoad;

function generateHarvesterBody(room) {
    let capacity = room.energyCapacityAvailable;
    let harvester_body = [];
    while (capacity > 0) {
        if(capacity >= BODYPART_COST[WORK] && capacity >= 150) {
            harvester_body.push(WORK);
            capacity -= BODYPART_COST[WORK];
        } else {
            harvester_body.push(MOVE);
            capacity = 0;
        }
    }
    return harvester_body;
}

//generates config for a lvl 1 room
var config3 = function(room) {
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

    // console.log('c9');
    let sources = room.find(FIND_SOURCES);
    // console.log('c10');
    let harvester_max = sources.length;
    _.forEach(sources, function(source) {


        buildRoad(config, room, spawn.pos, source.pos);

    });

    buildRoad(config, room, spawn.pos, room.controller.pos);

    // max is a number, current is an array of extension objects
    let max_extensions = CONTROLLER_STRUCTURES.extension[room.controller
        .level]; //const with structure maxes by rcl
    let current_extensions = room.find(FIND_STRUCTURES, {
        filter: (s) => {
            return (s.structureType == STRUCTURE_EXTENSION)
        }
    });
    console.log(`max extensions ${max_extensions}, current ${current_extensions.length}`)
    let x = spawn.pos.x;
    let y = spawn.pos.y;
    let spawn_tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1);


    //REVIEW controller container placement needs to test for occupants
    let controller = room.controller;
    let cx = controller.pos.x;
    let cy = controller.pos.y;
    let tiles = room.lookAtArea(cy - 1, cx - 1, cy + 1, cx + 1, true);
    _.forEach(tiles, (tile) => {
        if(tile.x !== cx || tile.y !== cy) {
            config.queue.push({x: tile.x, y: tile.y, STRUCTURE_CONTAINER});
            console.log(`placing container at ${tile.x}, ${tile.y}.`);
            return false;
        }
    });


    // harvester_max = 10;

    // console.log('c19');

    config.creeps.harvester = {
        body: generateHarvesterBody(room),
        max: harvester_max,
        memory: {
            kin: 'harvester'
        }
    };
    // console.log('c20');

    //harvest work to upgrade work is 2/1
    let upgrader_max = Math.max(1, Math.floor(harvester_max * 0.3));
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

module.exports = config3;
