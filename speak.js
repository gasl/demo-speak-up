var spawn = require('child_process').spawn
	, http = require('http')
	, fs = require('fs')
	, util = require('util')
	, mime = require('mime');

http.createServer(

	function (req, res) {
		var filename;
		
		console.log("req.url", req.url);

		if (req.url === '/favicon.ico') {
			return res.end();
			
		} else if (req.url.indexOf('/say/') === 0) { // does the Url string start with /say/ ?

			var newMessage = decodeURIComponent(req.url.substr(5)) || "Let's speak up! Ok, but what do you want me to say?";
			
			generateNewFile(newMessage, function(err, filename){
				return res.end('<!DOCTYPE html><html><body><audio controls autoplay><source src="/play/' + filename + '"' +
								' type="audio/wav" /></audio></body></html>');
				
			});
			
		} else if (req.url.indexOf('/play/') === 0) {
			
			filename = decodeURIComponent(req.url.substr(6));
			readAudioFile(filename, res);
			
		} else {
			
			res.writeHead(404);
			return res.end();
		}

	}).listen(4000);

function generateNewFile(message, callback) {
	var randomNumber = Math.floor(Math.random() * 100000);
	var filename = 'file_' + randomNumber + '.wav';
	var filePath = process.cwd() + '/files/' + filename;

	// write to file
	var sp = spawn('say', ['-v', 'Victoria', '-o', filePath, '--data-format=LEF32@8000', message]); //	say -o hi.wav --data-format=LEF32@8000 "hello"
	
	sp.on('exit', function (code, signal) {
	  console.log('child process terminated due to receipt of signal '+signal);
		
		callback(null, filename);
	});
	
	// TODO: Convert to other formats
}

function readAudioFile(filename, res) {
	// TODO: validate for allowed file extension and path. Exclude: ...

	var filePath = process.cwd() + '/files/' + filename;
	var stat = fs.statSync(filePath);

	// TODO: detect the right file extension. Examples: ogg, wav

	res.writeHead(200, {
		'Content-Type':mime.lookup(filePath), // => e.g. 'audio/wav'
		'Content-Length':stat.size
	});
	
	var readStream = fs.createReadStream(filePath);
	
	return util.pump(readStream, res);
}