var rooms = {}
var users = {}
var messages = {}
var chats = {}

var Room_id = 0
function Room() 
{
	this.id = ++Room_id
	this.users = []
	this.code = ""
	this.chats = []
	rooms[this.id] = this
}

Room.prototype.add_user = function(user)
{
	this.users.splice(0,0,user.id)
}

Room.prototype.remove_user = function(user)
{
	this.users.splice(this.users.indexOf(user.id),1)
}

Room.prototype.add_chats = function(chat) 
{
	this.chats.splice(0,0,chat.id)
}

var User_id = 0
function User(name,websocket)
{
	this.id = ++User_id
	this.name = ""
    this.websocket=websocket;
	users[this.id] = this
}

User.prototype.set_name = function (name) { 
	this.name = name
}

User.prototype.send_message = function (message) {
    this.websocket.send(JSON.stringify(message));
}

var Chat_id = 0
function Chat(line)
{
	this.id = ++Chat_id
	this.line = line
	this.messages = []
	chats[this.id] = this
}

Chat.prototype.add_message = function (message) { 
	// add the new message to the end of these	
	this.messages.splice(this.messages.length,0,message)
}

var Message_id = 0
function Message(user, text) { 
	this.id = ++Message_id
	this.user = user
	this.text = text
	messages[this.id] = this
}

if (exports) { 
	exports.Room = Room
	exports.Message = Message
	exports.Chat = Chat
	exports.User = User
	exports.users = users
	exports.rooms = rooms
	exports.messages = messages
	exports.chats = chats
}
