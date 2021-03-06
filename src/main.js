var level_to_config_generator = require('config');
var systemBuild = require('system.build');
var systemSpawn = require('system.spawn');
var creep = require('creep');
var targetPool = require('targetPool');

function cleanup() {
    //deleted creep cleanup
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

//returns true if the structure has just been built
Structure.prototype.built = function() {
    let flags = Memory.eventFlags || {};
    if (flags[this.id] && flags[this.id].built) { //case: event already happened
        return false;
    } else if (!flags[this.id]) {
        let flag = {
            built: true
        };
        flags[this.id] = flag;
        return true;
    } else if (!flags[this.id].built) {
        return true
    }
    console.log('err structure.built not supposed to reach this point!!');
}

//event: returns true when the event triggers, otherwise false
Room.prototype.leveledUp = function() {
    let p_lvl = this.memory.p_lvl || -1;
    let lvl = this.controller.level;
    if (lvl) {
        if (lvl > p_lvl) {
            this.memory.p_lvl = lvl;
            console.log(`Room ${this.name} leveled up to ${this.controller.level}!`);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

module.exports.loop = function() {
    cleanup();
    let rooms = [];

    _.forEach(Game.spawns, function(spawn) {
        if (rooms.indexOf(spawn.room) == -1) {
            rooms.push(spawn.room);
        }
    });

    _.forEach(rooms, function(room) {
        if (room.leveledUp() == true || !room.memory.config || Game
            .time % 50 == 0) {
            let generator = level_to_config_generator[room.controller
                .level];
            generator(room);
        }
        var action_counter = {};
        var job_counter = {};
        var kin_counter = {};
        var target_counter = {};
        var target_requester = {};
        action_counter['total'] = 0;
        for (let indexCreep in Game.creeps) {
            let creep = Game.creeps[indexCreep];

            if (!creep.memory.action) {
                creep.memory.action = 'harvest';
            }
            if (!creep.memory.job) {
                creep.memory.job = 'gather';
            }
            creep.run(target_counter, target_requester);

            if (action_counter[creep.memory.action]) {
                action_counter[creep.memory.action] += 1;
                action_counter['total'] += 1;
            } else {
                action_counter[creep.memory.action] = 1;
                action_counter['total'] += 1;
            }

            if (job_counter[creep.memory.job]) {
                job_counter[creep.memory.job] += 1;
            } else {
                job_counter[creep.memory.job] = 1;
            }

            if (kin_counter[creep.memory.kin]) {
                kin_counter[creep.memory.kin] += 1;
            } else {
                kin_counter[creep.memory.kin] = 1;
            }
        }
        targetPool.updateTargetPool(room);

        // if (job_counter['gather'] > room.memory.config.creeps.harvester
        //     .max) {
        //     for (let indexCreep in Game.creeps) {
        //         let creep = Game.creeps[indexCreep];
        //
        //         if (creep.memory.kin == 'builder') {
        //             creep.memory.job = 'construct';
        //         }
        //     }
        // }

        // if (job_counter['total'] < 4) {
        //     _.forEach(Game.creeps, function(creep) {
        //         if (creep.memory.job != 'gather') {
        //             creep.memory.job = 'gather';
        //             creep.memory.action = 'harvest';
        //         }
        //     });
        // }
        systemBuild(room);
        systemSpawn(room, kin_counter);
        targetPool.distributeTargets(target_counter,
            target_requester);

        if (room.energyAvailable == room.energyCapacityAvailable) {
            for (let indexCreep in Game.creeps) {
                let creep = Game.creeps[indexCreep];

                if (creep.memory.kin == 'builder') {
                    if (creep.memory.job != 'construct') {
                        creep.memory.job = 'construct';
                        creep.memory.action = 'withdraw';
                        delete creep.memory.target;
                    }
                }

                if (creep.memory.kin == 'upgrader') {
                    if (creep.memory.job != 'upgrade') {
                        creep.memory.job = 'upgrade';
                        creep.memory.action = 'withdraw';
                        delete creep.memory.target;
                    }
                }
            }
        } else {
            for (let indexCreep in Game.creeps) {
                let creep = Game.creeps[indexCreep]; //can't be null
                let count = kin_counter['harvester'] || 0;
                if (creep.memory.kin == 'harvester' ||
                    count < room.memory.config
                    .creeps.harvester
                    .max / 2.0) {
                    if (creep.memory.job != 'gather') {
                        creep.memory.job = 'gather';
                        creep.memory.action = 'harvest';
                        delete creep.memory.target;
                    }
                }
            }
        }
    });
}
