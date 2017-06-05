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

//generates config for a lvl 1 room
var config1 = function(room) {
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

var config2 = function(room) {
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

        //add 5 extensions to the build queue
        let max_extensions = CONTROLLER_STRUCTURES.extension[room.controller
            .level]; //const with structure maxes by rcl
        _.forEach(spaces, (tile) => {
            let occupants = room.lookAt(tile.x, tile.y)
                .map( (obj) => { return obj.type === 'structure'} );
            if(!occupants) {
                config.queue.push({
                    x: tile.x,
                    y: tile.y,
                    structureType: STRUCTURE_EXTENSION
                });
                max_extensions -= 1;
            }
            if (max_extensions == 0) {
                return false;
            }
        });

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

var level_to_config_generator = {
    0: {},
    1: config1,
    2: config2,
    3: config2,
    4: config2,
    5: config2,
    6: config2,
    7: config2,
    8: config2
};

module.exports = level_to_config_generator;
