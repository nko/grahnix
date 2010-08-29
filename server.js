var http = require('http')
var url = require('url')
var fs = require('fs')
var Mu = require ('./lib/mu')
var ws = require('./lib/ws')
var model = require('./model')

Mu.templateRoot = './templates/'
var HTTP_PORT = 80
var WS_PORT = 8451

/** 
 * Hard coding some context (for now) to get the room page working 
 */
var room = new model.Room()
room.add_chats(new model.Chat())
room.add_chats(new model.Chat())
room.add_chats(new model.Chat())
user = new model.User('kevin')
model.chats[room.chats[1]].add_message(new model.Message(user, 'Test Message'))
model.chats[room.chats[1]].add_message(new model.Message(user, 'Anyone there??'))
/** 
 * Done hardcoding - remove this later!
 */
var context = {
	room: room,
	chats: room.chats
}
var users = [];
var websockets = {};


/**
 * A simple HTTP server - knows how to serve js, css, png files and mustache templates
 */
http.createServer(function(req,res) { 
    // look at the request's path type - if /images/ - we're looking for an image
	// if /anything_else - we're looking for a template (of that name)
    var template = 'home.html';
	if (req.url.indexOf('/css/') == 0) { 
		fs.readFile('.'+req.url, function(err, data) { 
			res.writeHead(200, {"Content-Type": "text/css"})
			res.end(data)
		})
	}else
	if (req.url.indexOf('/js/') == 0) { 
		fs.readFile('.'+req.url, function(err, data) {
			res.writeHead(200, {"Content-Type": "application/javascript"})
			res.end(data)
		})
	} else if (req.url.indexOf('/images/') == 0) { 
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
}).listen(HTTP_PORT)



/**
 * web socket server - 
 *
 * needs to track users - they can enter or leave class rooms 
 * and send messages to coordinate chats, per classroom.
 *
 * create / delete classrooms
 *
 * create / delete coordinate chats (coordinates are line number only)
 *
 */
ws.createServer(function( socket ) { 
	socket
		.addListener('error', function ( e )  { 
			console.log("Error "+e)
		})
		.addListener('connect', function ( data ) {
			console.log("Websocket connected")
		})
		.addListener('data', function( data ) {
			var message = JSON.parse( data )
			switch ( message.type ) { 
				case 'new_user':
				break;
				case 'join_room':
				break;
				case 'login':
				break;
				case 'code_update':
				break;
				case 'chat_message':
				break;
				default:
				break;
			}
		})
}).listen(WS_PORT)
