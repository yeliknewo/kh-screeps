var cnst = require('targetPoolConstants');

function makeFinder(temp_id, temp_interval, temp_offset, temp_func) {
    return {
        id: temp_id,
        interval: temp_interval,
        offset: temp_offset,
        func: temp_func
    };
}

var finderEnergySource = makeFinder(cnst.energySource, cnst.energySourceInterval,
    cnst.energySourceOffset,
    function(room, pool) {
        pool[cnst.energySource] = toIDs(room.find(FIND_SOURCES));
    }
);

var finderEnergySupply = makeFinder(cnst.energySupply, cnst.energySupplyInterval,
    cnst.energySupplyOffset,
    function(room, pool) {
        var energySupply = [];

        var sources = room.find(FIND_SOURCES);
        for (var indexSource in sources) {
            // console.log("tp1");
            var source = sources[indexSource];

            var structures = room.lookForAtArea(LOOK_STRUCTURES, source.pos
                .y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x +
                1, true);

            room.memory.kappa = structures;

            for (var indexStructures in structures) {
                // console.log("tp2");
                var structure = structures[indexStructures];

                if (structure.structureType == STRUCTURE_CONTAINER) {
                    // console.log("tp3");
                    energySupply.push(structure.id);
                }
            }
        }

        if (energySupply.length == 0) {
            var structures = room.find(FIND_STRUCTURES, {
                filter: (struct) => {
                    return struct.structureType ==
                        STRUCTURE_SPAWN || struct.structureType ==
                        STRUCTURE_EXTENSION;
                }
            });

            for (var indexStructure in structures) {
                energySupply.push(structures[indexStructure].id);
            }
        }

        pool[cnst.energySupply] = energySupply;
    }
);

var finderEnergyStorage = makeFinder(cnst.energyStorage, cnst.energyStorageInterval,
    cnst.energyStorageOffset,
    function(room, pool) {
        if (pool[cnst.energySupply]) {
            var structures = room.find(
                FIND_STRUCTURES, {
                    filter: (struct) => {
                        return struct.structureType ==
                            STRUCTURE_CONTAINER || struct.structureType ==
                            STRUCTURE_SPAWN || struct.structureType ==
                            STRUCTURE_EXTENSION;
                    }
                }
            );

            var structuresStorage = toIDs(structures);

            for (var indexStructureStorage in structuresStorage) {
                var structureStorage = structures[indexStructureStorage];

                for (var indexStructureSupply in pool[cnst.energySupply]) {
                    var structureSupply = pool[cnst.energySupply][
                        indexStructureSupply
                    ];

                    if (structureStorage == structureSupply) {
                        structuresStorage.splice(indexStructureStorage, 1);
                    }
                }
            }

            pool[cnst.energyStorage] = structuresStorage;
        } else {
            delete pool[cnst.energyStorage];
        }
    }
);

var finderEnergyPrep = makeFinder(cnst.energyPrep, cnst.energyPrepInterval,
    cnst.energyPrepOffset,
    function(room, pool) {

    }
);

var finderEnergyDrain = makeFinder(cnst.energyDrain, cnst.energyDrainInterval,
    cnst.energyDrainOffset,
    function(room, pool) {
        pool[cnst.energyDrain] = [room.controller.id];
    }
);

var finderResourcesDropped = makeFinder(cnst.resourcesDropped, cnst.resourcesDroppedInterval,
    cnst.resourcesDroppedOffset,
    function(room, pool) {

    }
);

var finderConstructionSites = makeFinder(cnst.constructionSite, cnst.constructionSiteInterval,
    cnst.constructionSiteOffset,
    function(room, pool) {
        pool[cnst.constructionSite] = toIDs(room.find(
            FIND_CONSTRUCTION_SITES));
    }
);

var finderCreepsPlayer = makeFinder(cnst.creepsPlayer, cnst.creepsPlayerInterval,
    cnst.creepsPlayerOffset,
    function(room, pool) {

    }
);

var finderCreepsOther = makeFinder(cnst.creepsOther, cnst.creepsOtherInterval,
    cnst.creepsOtherInterval,
    function(room, pool) {

    }
);

// var stateResources = 0;
// var stateCreeps = 1;
// var stateStructures = 2;
//
// var poolFindStates = [stateResources, stateCreeps, stateStructures];
//
// function filterStucturesToPool(pool, structures, structureType) {
//     pool[structureType] = toIDs(_.filter(structures, function(struct) {
//         return struct.structureType == structureType;
//     }));
// }
//
// function filterToPool(room, pool, find) {
//     filterToPoolNamed(room, pool, find, find);
// }
//
// function filterToPoolNamed(room, pool, find, named) {
//     pool[named] = toIDs(room.find(find));
// }
//
// var finderStructure = function(room, pool) {
//     // console.log('tp7');
//
//     var structures = room.find(FIND_STRUCTURES);
//
//     pool['energyStorage'] = toIDs(_.filter(structures, function(struct) {
//         return struct.structureType == STRUCTURE_SPAWN ||
//             struct.structureType == STRUCTURE_EXTENSION ||
//             struct.structureType == STRUCTURE_CONTAINER ||
//             struct.structureType == STRUCTURE_TOWER || struct.structureType ==
//             STRUCTURE_STORAGE;
//     }));
//
//     let useSpawn = _.filter(structures, function(struct) {
//         return struct.structureType == STRUCTURE_CONTAINER ||
//             struct.structureType == STRUCTURE_STORAGE;
//     }).length < 2;
//
//     pool['energySupply'] = toIDs(_.filter(structures, function(struct) {
//         return struct.structureType == STRUCTURE_CONTAINER ||
//             struct.structureType == STRUCTURE_STORAGE || (
//                 useSpawn && struct.structureType ==
//                 STRUCTURE_SPAWN);
//     }));
//
//     var filters = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION,
//         STRUCTURE_CONTAINER
//     ];
//
//     for (var indexFilter in filters) {
//         filterStucturesToPool(pool, structures, filters[indexFilter]);
//     }
//
//     pool[cnst.controller] = [room.controller.id];
// };
//
// var finderResource = function(room, pool) {
//     // console.log('tp8');
//     var filters = [FIND_SOURCES, FIND_DROPPED_RESOURCES,
//         FIND_CONSTRUCTION_SITES
//     ];
//     // console.log('tp10');
//     for (var indexFilter in filters) {
//         // console.log('tp11');
//         filterToPool(room, pool, filters[indexFilter]);
//         // console.log('tp12');
//     }
// };
//
// var finderCreep = function(room, pool) {
//     // console.log('tp9');
//
//     var filters = [FIND_MY_CREEPS, FIND_HOSTILE_CREEPS];
//
//     for (var indexFilter in filters) {
//         filterToPool(room, pool, filters[indexFilter]);
//     }
// };

function toIDs(array) {
    var new_array = [];
    for (let i in array) {
        let object = array[i];
        new_array.push(object.id);
    }
    return new_array;
}

// var finders = {
//     0: finderResource,
//     1: finderCreep,
//     2: finderStructure,
//     3: finderEnergySupply.func,
//     4: finderEnergySource.func,
//     5: finderEnergyStorage.func
// };

var finders = [
    finderEnergySource, finderEnergySupply, finderEnergyStorage,
    finderEnergyPrep, finderEnergyDrain, finderResourcesDropped,
    finderConstructionSites, finderCreepsPlayer, finderCreepsOther
];

function getRandomElement(array) {
    if (array) {
        return array[Math.floor(Math.random() * (array.length - 1))] ||
            undefined;
    } else {
        return undefined;
    }
}

function updateTargetPool(room) {
    let needsInit = room.memory.needsInit;
    if (needsInit === undefined) {
        needsInit = true;
    }

    if (needsInit == true) {
        console.log(needsInit)
        room.memory.needsInit = false;
        let pool = room.memory.pool || {};
        for (var indexFinder in finders) {
            console.log(indexFinder)
            finders[indexFinder](room, pool);
        }
        room.memory.pool = pool;
    } else {

        // console.log('tp1');
        let pool = room.memory.pool || {};
        // console.log('tp2');
        // let statePointer = pool.statePointer || 0;
        // console.log('tp3');
        //let finderKey = poolFindStates[statePointer];
        // console.log('tp4');
        // let finder = finders[statePointer]; // ??
        // console.log('tp5');
        for (var indexFinder in finders) {
            let finder = finders[indexFinder];

            if ((Game.time + finder.offset) % finder.interval == 0) {
                finder.func(room, pool);
            }
        }
        // finder(room, pool);
        // console.log('tp6');
        // pool.statePointer = (pool.statePointer + 1) % Object.keys(finders).length //% poolFindStates.length;
        room.memory.pool = pool;
    }
}

function distributeTargets(target_counter, target_requester) {
    for (var indexRequest in target_requester) {
        let request = target_requester[indexRequest];

        let creep = Game.getObjectById(indexRequest);
        let pool = creep.room.memory.pool;
        let targets = pool[request.structureType];
        if (request.params) {
            console.log(
                'Target request parameters are not implemented!'); //TODO
        }
        var least_used = undefined;
        var usage = 1000; //convenience number
        _.forEach(targets, function(id) {
            let count = target_counter[id] || 0;
            if (count < usage) {
                usage = count;
                least_used = id;
            }
        });
        //console.log(`Got target ${least_used} for creep ${creep.name}.`);
        // console.log('Usage: ', least_used, usage);

        let prev_target = creep.memory.target;
        if (least_used == prev_target) { //then get a random one instead!
            creep.memory.target = getRandomElement(targets); //REVIEW
        } else {
            creep.memory.target = least_used;
        }
    }
}

module.exports = {
    updateTargetPool,
    distributeTargets
};
