var job_to_actions = {
    'gather': ['harvest', 'transfer'],
    'upgrade': ['withdraw', 'upgradeController'],
    'construct': ['withdraw', 'build'],
    'collect': ['pickup', 'transfer'],
}

var wait = function(creep, target, target_requester) {
    let result = creep.moveTo(target);
}

//REVIEW
//for harvesters without carry parts
var mine = function(creep, target, target_requester) {
    let result = creep.harvest(target);
    if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        if (creep.memory.stationary > 3) {
            creep.needTarget(target_requester, FIND_SOURCES);
        }
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action Mine.`
        );
        creep.needTarget(target_requester, FIND_SOURCES);
    }
}

var harvest = function(creep, target, target_requester) {
    let result = creep.harvest(target);
    if (creep.carry.energy == creep.carryCapacity) {
        let new_action = creep.nextAction();

        creep.needTarget(target_requester, 'energyStorage');
    } else if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (creep.carry.energy == 0 && creep.memory.stationary >
        3) {
        creep.needTarget(target_requester, FIND_SOURCES);
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action Harvest.`
        );
        creep.needTarget(target_requester, FIND_SOURCES);
    }
}

var transfer = function(creep, target, target_requester) {
    let result = creep.transfer(target, RESOURCE_ENERGY);
    if (creep.carry.energy == 0) {
        creep.nextAction();
        creep.needTarget(target_requester, FIND_SOURCES);
    } else if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (creep.carry.energy == creep.carryCapacity && creep.memory.stationary >
        2) {
        creep.memory.job = 'construct';
        creep.nextAction();
        creep.needTarget(target_requester, FIND_CONSTRUCTION_SITES);
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action Transfer.`
        );
        creep.needTarget(target_requester, 'energyStorage');
    }
}

var withdraw = function(creep, target, target_requester) {
    let result = creep.withdraw(target, RESOURCE_ENERGY);

    if (creep.carry.energy == creep.carryCapacity) {
        let nextAction = creep.nextAction();
        if (nextAction == 'upgradeController') {
            creep.needTarget(target_requester, STRUCTURE_CONTROLLER);
        } else if (nextAction == 'build') {
            creep.needTarget(target_requester, FIND_CONSTRUCTION_SITES);
        }
    } else if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (creep.carry.energy < creep.carryCapacity && creep.memory.stationary >
        5) {
        //REVIEW
        creep.needTarget(target_requester, 'energySupply');
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action Withdraw.`
        );
        creep.needTarget(target_requester, 'energySupply');
    }
}

var upgradeController = function(creep, target, target_requester) {
    let result = creep.upgradeController(target);
    if (result == ERR_NOT_ENOUGH_RESOURCES) {
        creep.nextAction();
        creep.needTarget(target_requester, 'energySupply');
    } else if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action UpgradeController.`
        );
        creep.needTarget(target_requester, STRUCTURE_CONTROLLER);
    }
}

var build = function(creep, target, target_requester) {
    let result = creep.build(target);
    if (creep.carry.energy == 0) {
        creep.nextAction();
        creep.needTarget(target_requester, 'energySupply');
    } else if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action Build.`
        );
        creep.needTarget(target_requester, FIND_CONSTRUCTION_SITES);
    }
}

var pickup = function(creep, target, target_requester) {
    let result = creep.pickup(target);
    if (creep.carry.energy == creep.carryCapacity) {
        creep.nextAction();
        creep.needTarget(target_requester);
    } else if (result == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    } else if (result == ERR_INVALID_TARGET) {
        console.log(
            `Creep ${creep.name} had invalid target ${creep.memory.target} for action Pickup.`
        );
        creep.needTarget(target_requester);
    }
}

var actions_to_functions = {
    'harvest': harvest,
    'transfer': transfer,
    'withdraw': withdraw,
    'upgradeController': upgradeController,
    'build': build,
    'pickup': pickup,
    'mine': mine,
}

module.exports = {
    job_to_actions,
    actions_to_functions
}
