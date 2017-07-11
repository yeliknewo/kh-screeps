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
            // store structure ids in pool, by their types
            var containers = [];
            var spawns = [];
            var extensions = [];
            _.forEach(structures, (s) => {
                switch (s.structureType) {
                    case STRUCTURE_CONTAINER:
                        containers.push(s.id);
                        break;

                    case STRUCTURE_SPAWN:
                        spawns.push(s.id);
                        break;

                    case STRUCTURE_EXTENSION:
                        extensions.push(s.id);
                        break;
                }
            });
            pool.containers = containers;
            pool.spawns = spawns;
            pool.extensions = extensions;

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

function toIDs(array) {
    var new_array = [];
    for (let i in array) {
        let object = array[i];
        new_array.push(object.id);
    }
    return new_array;
}

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
    if (needsInit === undefined || needsInit == true) {
        room.memory.needsInit = false;
        let pool = room.memory.pool = {};
        for (var indexFinder in finders) {
            // console.log(indexFinder)
            finders[indexFinder].func(room, pool);
        }
        room.memory.finderRequests = {};
        // console.log(room.memory.finderRequests);
    } else {
        let pool = room.memory.pool;
        for (var indexFinder in finders) {
            let finder = finders[indexFinder];


            if ((room.memory.pool.finderRequests && room.memory.pool.finderRequests[
                    indexFinder] == true) || (Game.time +
                    finder.offset) % finder.interval == 0) {
                room.memory.finderRequests[indexFinder] = false;
                finder.func(room, pool);
            }
        }

    }
}

function distributeTargets(target_counter, target_requester) {
    for (var indexRequest in target_requester) {
        let request = target_requester[indexRequest];

        let creep = Game.getObjectById(indexRequest);
        let room = creep.room;
        let pool = room.memory.pool;
        if (pool) {
            let targets = pool[request.poolId];
            if (request.params) {
                console.log(
                    'Target request parameters are not implemented!'); //TODO
            }
            var least_used = [];
            var usage = 1000;
            _.forEach(targets, function(id) {
                let count = target_counter[id] || 0;
                if (count < usage) {
                    usage = count;
                    least_used = [id];
                } else if (count == usage) {
                    least_used.push(id);
                }
            });

            // console.log(`Got target ${least_used} for creep ${creep.name}.`);
            // console.log('Usage: ', least_used, usage);

            var bestId = undefined;
            var bestDistance = 10000;
            _.forEach(least_used, function(id) {
                var target = Game.getObjectById(id);
                if (target) {
                    var distance = target.pos.getRangeTo(creep.pos);
                    if (distance < bestDistance) {
                        bestId = id;
                        bestDistance = distance;
                    }
                }
            });
            let prev_target = creep.memory.target;
            if (bestId == prev_target) { //then get a random one instead!
                creep.memory.target = getRandomElement(targets); //REVIEW
            } else {
                creep.memory.target = bestId;
            }
        }
    }
}

module.exports = {
    updateTargetPool,
    distributeTargets
};
