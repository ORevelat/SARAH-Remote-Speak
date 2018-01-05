var http = require('http');
var querystring = require('querystring');

var server  = http.createServer();
var localPort = 10002;

var speak = "bin/speak.exe";

var sendAnswer = function(res, isOk) {
	res.writeHead(isOk ? 200 : 404, {'Content-Type': 'text/plain'});
	res.end(isOk ? 'OK' : 'KO');
	
	return true;
};

var isTTSRequest = function(req, callback) {
	var rePattern = /^\/speak\?tts=(.+)$/
	var arr = req.url.match(rePattern);
	if (arr == null)
		return false;

	callback(querystring.unescape(arr[1]));
	return true;
};

var doSpeak = function(tts, res) {
    let args = ['-tts', tts];

	const child = require('child_process').spawn(speak, args);

    child.stdout.on('data', function(data) {
        // console.log(data)
    });
    child.stderr.on('data', function(data) {
		sendAnswer(res, false);
    });
    child.on('close', function(code) {
		sendAnswer(res, true);
		console.log('@@@ Process "speak.exe" pid=' + child.pid + ' closed (code=' + code + ')');
	});
    child.on('error', function(err) {
		sendAnswer(res, false);
		console.log('@@@ Process "speak.exe" pid=' + child.pid + ' closed (code=' + code + ')');
	});
};

server.listen(localPort);

server.on('listening', function(){
	console.log('Sarah speak server started - listening to ', localPort);
});

server.on('request', function(req, res) {
	if (req.method != 'GET')
	{
		return sendAnswer(res, false);
	}

	if (isTTSRequest(req, function(tts) {
		// perform speak
		doSpeak(tts, res);
	})) {
		return;
	}

	return sendAnswer(res, false);
});

server.on('error', function(err) {
	console.log(err);
});
