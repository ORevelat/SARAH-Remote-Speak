const fs = require('fs');

const helper  = require('node-red-viseo-helper');

// --------------------------------------------------------------------------
//  NODE-RED
// --------------------------------------------------------------------------

module.exports = function(RED) {
    const register = function(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        this.on('input', (data)  => { input(node, data, config)  });
    }
    RED.nodes.registerType("win-speak-remote", register, {});
}

const input = (node, data, config) => {
    let tts = helper.getByString(data, config.input || 'payload', config.input);
    if (!tts) return;

    let options = RED.nodes.getNode(config.options);

    // lets start the remote process
    var url = 'http://' + options.remoteip + ':' + options.remoteport + '/tts?' + querystring.en;

    // todo
}