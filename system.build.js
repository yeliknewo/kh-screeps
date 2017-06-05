function systemBuild(room) {
    let queue = room.memory.config.queue;
    if (queue && queue.length > 0) {
        let active_sites = room.memory.pool[FIND_CONSTRUCTION_SITES].length; //REVIEW
        let max_builders = room.memory.config.creeps.builder.max || 3;
        if (active_sites < max_builders) {
            while (active_sites < max_builders) {
                let new_site = queue.shift();
                if (new_site) {
                    room.createConstructionSite(new_site.x, new_site.y,
                        new_site.structureType);
                    active_sites += 1;
                } else {
                    break; //no more sites to place :(
                }
            }
        }
    }
}

module.exports = systemBuild;
