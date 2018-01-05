const helper = require('node-red-viseo-helper');

module.exports = function(RED) {

    RED.nodes.registerType("win-speak-remote-config", function(config){
        RED.nodes.createNode(this, config);
        this.name        = config.name;
        this.setup = () => {
            return  { 
                proc: helper.resolve(config.process),   
                remoteip:   config.remoteip,
                remoteport: config.remoteport,
            }
        }
    }, {});

}