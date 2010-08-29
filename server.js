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
				case 'login':
					// create new user, send room list.
                    var u=new model.User(message.username,socket);
					u.send_message({status:"ok", rooms:model.rooms, user_id:""+u.id+""})
					break;
				case 'create_room':
					// create room, send room list
					var u=model.users[message.user_id]
					console.log('users '+model.users)
					console.log('create room:' + message.user_id)
					room = new model.Room(model.users[message.user])
					u.send_message({status:"ok", rooms:model.rooms})
					break;
				case 'join_room':
					console.log(message)
					// add user to room, send user list and chat list
					var r = model.rooms[message.room_id]
					var u = model.users[message.user_id]
					r.add_user(u)
                    // send new user the chat history (maybe room state in future?)
                    // TODO make this less cumbersome, maybe exchange and store chats as lighweight objects:
                    // .e.g {line:null,text:"blahblah",user:"nikolaj"}
                    console.log("updating with "+room.chats.length+" chats");
                    u.send_message({room_id:room.id, chats:r.chats, users:r.users});
                    break;
				case 'create_chat':
					u = model.users[message.user_id]	
					r = model.rooms[message.room_id]
					c = new model.Chat(message.line_number, u)
					r.add_chat(c)
					u.send_message({status:"ok", chats:r.chats})
					break;
				case 'message':
					u = model.users[message.user_id]
					c = model.chats[message.chat_id]
					r = model.rooms[message.room_id]
					m = new model.Message(u, message.text)
					c.add_message(m)
					u.send_message({status:"ok", chats:r.chats})
					break;
					/*
				case 'chat_message':
                    console.log("new chat: "+message.message);
                    var chat = {text:message.message,user:'n/a'};
                    room.add_chat(chat);

                    // TODO in the future this should be taken care of by 
                    // users getting notified of a new state
                    for(var i=0;i<room.users.length;i++){
                        var u = model.users[room.users[i]];
                        // TODO get user based upon socket!
                        u.send_message({type:"chat_message",chats:[chat]});
                    }
    				break;
					*/
				default:
				    break;
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

