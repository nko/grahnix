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

var WEBROOT = path.join(path.dirname(__filename), 'webroot');
var paperboy = require("./includes/paperboy");
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
		.addListener('close', function ( data ) { 
			console.log("Socket closed")
			for (var i in model.users) { 
				if (model.users[i].websocket == socket) { 
					for (j in model.rooms) {
						model.rooms[j].remove_user(model.users[i])
					}
				}
			}
			for (var i in model.rooms) { 
				for (var j in model.rooms[i].users) { 
					model.rooms[i].users[j].send_message({users:model.rooms[i].users})
				}
			}
		})
		.addListener('connect', function ( data ) {
			console.log("Websocket connected")
		})
		.addListener('data', function( data ) {
			var message = JSON.parse( data )
			switch ( message.type ) { 
				case 'login':
					// create new user, send room list.
                    var u=new model.User(message.username,socket);
					u.send_message({status:"ok", rooms:model.rooms, user_id:""+u.id+""})
					break;
				case 'create_room':
					// create room, send room list
					var u=model.users[message.user_id]
					console.log('create room:' + message.user_id)
					var room = new model.Room(model.users[message.user])
					room.add_user(u)
					chat = new model.Chat(0, users[message.user])
					room.add_chat(chat)
					u.send_message({rooms:model.rooms, room_id:room.id, chats:room.chats, code:room.code[0], users:room.users})
					for (i in model.users) { 
						model.users[i].send_message({rooms:model.rooms})
					}
					break;
				case 'join_room':
					console.log(message)
					// add user to room, send user list and chat list
					var r = model.rooms[message.room_id]
					var u = model.users[message.user_id]
					r.add_user(u)
					// send the person who logged in full room info
					latest_rev = r.code.length-1
                    u.send_message({room_id:r.id, chats:r.chats, users:r.users, code:r.code[latest_rev]});
					// everyone else should get an updated user list.
					for (i in r.users) { 
						if (r.users[i].id != u.id) { 
							r.users[i].send_message({ users:r.users })
						}
					}
                    break;
				case 'leave_room':
					console.log(message)
                    console.log ("Leave room for u"+message.user_id+" from r"+message.room_id)
					var r = model.rooms[message.room_id]
					var u = model.users[message.user_id]
					r.remove_user(u)
					for (i in r.users) { 
						r.users[i].send_message({users:r.users})
					}
					break;
				case 'create_chat':
					u = model.users[message.user_id]	
					r = model.rooms[message.room_id]
					c = new model.Chat(message.line_number, u)
					r.add_chat(c)
					for (i in r.users) { 
						r.users[i].send_message({status:"ok", chats:r.chats})
					}
					break;
				case 'message':
					u = model.users[message.user_id]
					c = model.chats[message.chat_id]
					r = model.rooms[message.room_id]
					m = new model.Message(u, message.text)
					c.add_message(m)
					for (i in r.users) { 
						r.users[i].send_message({status:"ok", chats:r.chats})
					}
					break;
				case 'code_update':
					u = model.users[message.user_id]
					c = model.chats[message.chat_id]
					r = model.rooms[message.room_id]
					r.code.push( message.code )
					revision_number = r.code.length-1;
					m = new model.Message(u, u.name + " has shared revision #"+revision_number)
					m.type="code_notify"
					m.rev=r.code.length-1
					for (var i in r.chats) { 
						r.chats[i].add_message(m)
					}

					for (var i in r.users) { 
						r.users[i].send_message({chats:r.chats})
					}
					break;
				case 'code_request':
					u = model.users[message.user_id]
					r = model.rooms[message.room_id]
					console.log("User "+message.user_id+" asked for revision "+message.rev+" for room "+message.room_id)
					rev = message.rev
					u.send_message({'code':r.code[rev]})
					break	
				default:
				    break
			}
		})
}).listen(WS_PORT)

http.createServer(function (req, res) {
  paperboy
    .deliver(WEBROOT, req, res)
    .before(function() {
      //sys.puts('About to deliver: '+req.url);
    })
    .after(function() {
      //sys.puts('Delivered: '+req.url);
    })
    .error(function() {
      //sys.puts('Error delivering: '+req.url);
    })
    .otherwise(function() {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('Sorry, no paper this morning!');
      res.end();
    });
}).listen(HTTP_PORT);

