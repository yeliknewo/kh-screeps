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
}

//generates config for a lvl 1 room
var config3 = function(room) {
    // console.log('c1');
    let config = {};
    // console.log('c2');
    //generate a construction site queue
    config.queue = []; //build queue
    // console.log('c2');
    let spawn = Game.getObjectById(room.memory.pool[STRUCTURE_SPAWN][0]);
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

    let max_extensions = CONTROLLER_STRUCTURES.extension[room.controller
        .level]; //const with structure maxes by rcl

    let x = spawn.pos.x;
    let y = spawn.pos.y;
    const d = 3; //distance from spawn to place the 3x3 block of extensions
    let midpoints = [
        {x: x + d, y: y},
        {x: x - d,  y: y},
        {x: x, y: y + d},
        {x: x, y: y - d}
    ];
    _.forEach(midpoints, function(point) {
        let x = point.x;
        let y = point.y;
        let tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1, true);
        let occupants = tiles.map((obj) => {
            return obj.type === 'structure' ||
            (obj.type === 'terrain' && obj.terrain === 'wall')
        });
        //right and down is increasing in the screeps coordinate system
        //if no occupants, proceed
        //the layout looks like the side with 5 dots in a dice
        //O   O
        //  O
        //O   O
        if(!occupants.length) {
            config.queue.push({
                x: x - 1,
                y: y - 1,
                structureType: STRUCTURE_EXTENSION
            });
            config.queue.push({
                x: x + 1,
                y: y - 1,
                structureType: STRUCTURE_EXTENSION
            });
            config.queue.push({
                x: x ,
                y: y,
                structureType: STRUCTURE_EXTENSION
            });
            config.queue.push({
                x: x - 1,
                y: y + 1,
                structureType: STRUCTURE_EXTENSION
            });
            config.queue.push({
                x: x + 1,
                y: y + 1,
                structureType: STRUCTURE_EXTENSION
            });
            return false;
        }
    });

    // harvester_max = 10;

    // console.log('c19');

    config.creeps.harvester = {
        body: generateHarvesterBody,
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
