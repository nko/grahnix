var http = require('http')
var url = require('url')
var fs = require('fs')
var Mu = require ('./lib/mu')

function dump(obj) { 
	console.log("=====");
	for (o in obj) { 
		console.log(o+" "+obj[o]);
	}
	console.log("=END=");
}

Mu.templateRoot = './templates/'
var context = { serverName: 'Grahnix' } // no context
var server = http.createServer(function(req,res) { 
    // look at the request's path type - if /images/ - we're looking for an image
	// if /anything_else - we're looking for a template (of that name)
    var template = 'home.html';
	if (req.url.indexOf('/js/') == 0) { 
		fs.readFile('.'+req.url, function(err, data) {
			res.writeHead(200, {"Content-Type": "application/javascript"})
			res.end(data)
		})
	} else if (req.url.indexOf('/images/') == 0) { 
		// read image and dump
		fs.readFile(Mu.templateRoot+req.url, function(err,data) { 
			if (err) throw err
			res.writeHead(200, {"Content-Type": "image/png"})
			res.end(data)
		})
	}
	else {  
		if (req.url != '/') { 
		template = req.url.substr(1);
		}
		res.writeHead(200, {"Content-Type": "text/html"})
		Mu.render(template, context,{}, function (err, output) { 
			if (err) { 
				res.writeHead(404, {"Content-Type": "text/html"}) 
				res.end("<h1>Page not Found "+req.url+"</h1>");
			}
			else { 
				output
					.addListener('data', function(c) { res.write(c); })
					.addListener('end',function(){res.end()})
			}
		})
	}
})

server.listen(80)
