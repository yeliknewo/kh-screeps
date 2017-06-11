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

function placeContainersAtSources(source, room, config) {
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

    return spaces.length;
}

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
            return struct.structureType == STRUCTURE_SPAWN;
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
        harvester_max += placeContainersAtSources(source, room,
            config);

        buildRoad(config, room, spawn.pos, source.pos);
        // console.log('c18');
    });

    buildRoad(config, room, spawn.pos, room.controller.pos);

    // harvester_max = 10;

    // console.log('c19');

    // harvester_max = 6;

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

    config.creeps.order = [config.creeps.harvester, config.creeps.upgrader,
        config.creeps.builder
    ];

    room.memory.config = config;
}

var config2 = function(room) {
    // console.log('c1');
    let config = {};
    // console.log('c2');
    //generate a construction site queue
    config.queue = []; //build queue
    // console.log('c2');
    let spawn = room.find(FIND_STRUCTURES, {
        filter: (struct) => {
            return struct.structureType == STRUCTURE_SPAWN;
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



        buildRoad(config, room, spawn.pos, source.pos);
        // console.log('c18');
    });

    buildRoad(config, room, spawn.pos, room.controller.pos);

    //add 5 extensions to the build queue
    let max_extensions = CONTROLLER_STRUCTURES.extension[room.controller
        .level]; //const with structure maxes by rcl

    let x = spawn.pos.x;
    let y = spawn.pos.y;
    const d = 3; //distance from spawn to place the 3x3 block of extensions
    let midpoints = [{
        x: x + d,
        y: y
    }, {
        x: x - d,
        y: y
    }, {
        x: x,
        y: y + d
    }, {
        x: x,
        y: y - d
    }];
    _.forEach(midpoints, function(point) {
        let x = point.x;
        let y = point.y;
        let tiles = room.lookAtArea(y - 1, x - 1, y + 1, x + 1,
            true);
        let occupants = tiles.map((obj) => {
            return obj.type === 'structure' ||
                (obj.type === 'terrain' && obj.terrain ===
                    'wall')
        });
        //right and down is increasing in the screeps coordinate system
        //if no occupants, proceed
        //the layout looks like the side with 5 dots in a dice
        //O  O
        //  O
        //O  O
        if (!occupants.length) {
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
                x: x,
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

    // console.log('c19');

    // harvester_max = 6;

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

    config.creeps.order = [config.creeps.harvester, config.creeps.upgrader,
        config.creeps.builder
    ];

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
