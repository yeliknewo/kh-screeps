var cnst = require('targetPoolConstants');

function systemBuild(room) {
    let queue = room.memory.config.queue;
    if (queue && queue.length > 0) {
        let active_sites = room.memory.pool[cnst.constructionSite].length; //REVIEW
        let max_builders = room.memory.config.creeps.builder.max || 3;
        if (active_sites < max_builders) {
            cnst.requestFinder(room, cnst.constructionSite);
            while (active_sites < max_builders) {
                let new_site = queue.shift();
                if (new_site) {
                    let result = room.createConstructionSite(new_site.x,
                        new_site.y,
                        new_site.structureType);
                    // if (result == OK) {
                    active_sites += 1;
                    // } else if (ERR_RCL_NOT_ENOUGH) {
                    //     room.memory.config.queue.push(new_site);
                    //if rcl isnt enough, push it onto the end of the queue
                    //this allows for keeping sites that cant be placed yet cycled
                    // }
                } else {
                    break; //no more sites to place :(
                }
            }
        }
    }
}

module.exports = systemBuild;
