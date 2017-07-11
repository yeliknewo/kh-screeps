var job = require('job');
var job_to_actions = job.job_to_actions;
var actions_to_functions = job.actions_to_functions;

//creeps are grouped by action

//runs the creep using an action and target
//gets new target based on action if necessary
Creep.prototype.run = function(target_counter, target_requester) {

    this.registerTarget(target_counter);

    //count the number of ticks this creep is stationary
    let prev = this.memory.prev || this.pos;
    if (this.pos.x == prev.x && this.pos.y == prev.y) {
        let count = this.memory.stationary || 0;
        count += 1;
        this.memory.stationary = count;
    } else {
        this.memory.stationary = 0;
    }
    this.memory.prev = this.pos;

    let target = Game.getObjectById(this.memory.target);
    actions_to_functions[this.memory.action](this, target, target_requester);
}

//associates actions to other actions
Creep.prototype.nextAction = function() {
    let current = this.memory.action;
    let job = this.memory.job; //a job is just a sequence of actions
    // console.log(job)
    if (job) {
        let actions = job_to_actions[job];
        let current_index = actions.indexOf(current);
        let next_index = (current_index + 1) % job_to_actions[job].length;
        let next_action = job_to_actions[job][next_index];
        //console.log(`Got next job->action ${next_action} for ${this.name}`);
        this.memory.action = next_action;
        return next_action;
    }
}

//tracks how many creeps are targeting something this tick
//this info will be used to select the targets with the smallest number of creeps working on it
Creep.prototype.registerTarget = function(target_counter) {
    if (target_counter[this.memory.target]) {
        target_counter[this.memory.target] += 1;
    } else {
        target_counter[this.memory.target] = 1;
    }
}

//gets a target based on the current action type of the creep
//structureType is required (one of the STRUCTURE_* constants)
//params is optional
Creep.prototype.needTarget = function(target_requester, poolId, params) {
    console.log(`Creep ${this.name} needs target.`)
    let request = {};
    request.poolId = poolId;
    if (params) {
        request.params = params;
    }
    target_requester[this.id] = request;
}
