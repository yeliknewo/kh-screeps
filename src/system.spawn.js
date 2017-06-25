//populates the room


Spawn.prototype.run = function(kin_counter) {
    let spawn = this;
    // console.log('ss1');
    let creeps = this.room.memory.config.creeps; //creep templates
    // console.log('ss2');
    if (!this.spawning) {
        // console.log('ss3');
        _.forEach(creeps, function(template) {
            // console.log('ss4');
            let kin = template.memory.kin;
            // console.log('ss5');
            let max = template.max;
            // console.log('ss6');
            if ((kin_counter[kin] || 0) < max) {
                // console.log('ss7');
                let result = spawn.createCreep(template.body, null,
                    template.memory);
                // console.log('ss8');
                // console.log(result);
                if (typeof(result) === String) {
                    // console.log('ss9');
                    return false; //breaks the loop. spawning succesful if createCreep returns a string
                }
                // console.log('ss10');
            }
            // console.log('ss11');
        });
        // console.log('ss12');
    }
    // console.log('ss13');
}

function systemSpawn(room, kin_counter) {
    // console.log('ss14');
    _.forEach(Game.spawns, function(spawn) {
        // console.log('ss15');
        spawn.run(kin_counter);
        // console.log('ss16');
    });
    // console.log('ss17');
}

module.exports = systemSpawn;
