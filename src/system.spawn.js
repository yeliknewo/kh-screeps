//populates the room


Spawn.prototype.run = function(kin_counter) {
    let spawn = this;
    let creeps = this.room.memory.config.creeps; //creep templates
    if (!this.spawning) {
        _.forEach(creeps, function(template) {
            let kin = template.memory.kin;
            let max = template.max;
            if ((kin_counter[kin] || 0) < max) {
                let result = spawn.createCreep(template.body, null,
                    template.memory);
                if (typeof(result) === String) {
                    return false; //breaks the loop. spawning succesful if createCreep returns a string
                }
            }
        });
    }
}

function systemSpawn(room, kin_counter) {
    _.forEach(Game.spawns, function(spawn) {
        spawn.run(kin_counter);
    });
}

module.exports = systemSpawn;
