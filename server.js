var http = require('http');

var server = http.createServer(function(req,res) { 
	res.writeHead(200, {"Content-Type": "text/html"})
	res.end("GRAHNIX because its *BETTER*");
});

server.listen(80);
