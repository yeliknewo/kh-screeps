var energySource = 0;
var energySupply = 1;
var energyStorage = 2;
var energyPrep = 3;
var energyDrain = 4;

var resourcesDropped = 5;
var constructionSite = 6;
var creepsPlayer = 7;
var creepsOther = 8;

var energySourceInterval = 150;
var energySupplyInterval = 10;
var energyStorageInterval = 10;
var energyPrepInterval = 10;
var energyDrainInterval = 10;

var resourcesDroppedInterval = 2;
var constructionSiteInterval = 5;
var creepsPlayerInterval = 5;
var creepsOtherInterval = 5;

var energySourceOffset = 0;
var energySupplyOffset = 1;
var energyStorageOffset = 2;
var energyPrepOffset = 3;
var energyDrainOffset = 4;

var resourcesDroppedOffset = 0;
var constructionSiteOffset = 0;
var creepsPlayerOffset = 1;
var creepsOtherOffset = 2;

module.exports = {
    energySource, energySupply, energyStorage,
    energyPrep,
    energyDrain, resourcesDropped, constructionSite, creepsPlayer,
    creepsOther, energySourceInterval, energySupplyInterval,
    energyStorageInterval, energyPrepInterval, energyDrainInterval,
    resourcesDroppedInterval, constructionSiteInterval,
    creepsPlayerInterval, creepsOtherInterval, energySourceOffset,
    energySupplyOffset, energyStorageOffset, energyPrepOffset,
    energyDrainOffset, resourcesDroppedOffset, constructionSiteOffset,
    creepsPlayerOffset, creepsOtherOffset
};
