var http = require('http')
var url = require('url')
var fs = require('fs')
var Mu = require ('./lib/mu')
var ws = require('./lib/ws')
var model = require('./model')
var path = require('path')
var sys = require('sys')

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
var WEBROOT = path.join(path.dirname(__filename), 'webroot');
var paperboy = require("paperboy");
var users = [];
var websockets = {};

process.argv.forEach(function (val, index, array) {
    var m = val.match(/--port=(\d+)$/);
    if(m!=null){
        HTTP_PORT=Number(m[1]);
        console.log("changed HTTP PORT to "+HTTP_PORT);
    }
});


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
				case 'join_room':
                    var u=new model.User(message.username,websocket);
                    room.add_user(u);
                    // send new user the chat history (maybe room state in future?)
                    u.send_message({source:"room",message:room.chats});
                    break;
				case 'chat_message':
                    for(var i=0;i<room.users.length;i++){
                        var u = room.users[i];
                        if(u.websocket != websocket){
                            u.send_message({type:"chat_message",message:data.message});
                            room.add_chat(new model.Chat(data.message));
                        }
                    }
    				break;
				default:
				    break;
			}
		})
}).listen(WS_PORT)

http.createServer(function (req, res) {
  paperboy
    .deliver(WEBROOT, req, res)
    .before(function() {
      sys.puts('About to deliver: '+req.url);
    })
    .after(function() {
      sys.puts('Delivered: '+req.url);
    })
    .error(function() {
      sys.puts('Error delivering: '+req.url);
    })
    .otherwise(function() {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('Sorry, no paper this morning!');
      res.end();
    });
}).listen(HTTP_PORT);

