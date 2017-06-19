var config1 = require('config1');
var config2 = require('config2');
var config3 = require('config3');

var level_to_config_generator = {
    0: {},
    1: config1,
    2: config2,
    3: config3,
    4: config3,
    5: config3,
    6: config3,
    7: config3,
    8: config3
};

module.exports = level_to_config_generator;
