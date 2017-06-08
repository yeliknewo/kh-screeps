var config1 = require('configs/config1');
var config2 = require('configs/config2');

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
