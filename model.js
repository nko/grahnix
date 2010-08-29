var rooms = []
var users = []
var messages = []
var chats = []

var Room_id = 0
function Room(owner) 
{
	this.id = Room_id++
	this.users = []
	this.code = "   \n\
float bgcolor = 0.0; \n\
boolean up = true;\n\
\n\
void setup() { \n\
	background(100)\n\
		size(550,200)\n\
}\n\
\n\
void draw() { \n\
	if (bgcolor == 255.0) { up = false; } \n\
	if (bgcolor == 0.0) { up = true; } \n\
\n\
	if (up) { bgcolor += 0.1; }  else { bgcolor -= 0.1;}\n\
	background(bgcolor);\n\
}	\n\
	"
	this.chats = []
	this.owner = owner
	rooms[this.id] = this
}

Room.prototype.add_user = function(user)
{
	this.users.push(user)
}

Room.prototype.remove_user = function(user)
{
	this.users.splice(this.users.indexOf(user),1)
}

// expect something like {line:35,user:joe,text:blah}
Room.prototype.add_chat = function(chat) 
{
    console.log("adding chat");
	this.chats.push(chat)
}

var User_id = 0
function User(name,websocket)
{
	this.id = User_id++
	this.name = name
    this.websocket=websocket;
	users[this.id] = this
}

User.prototype.set_name = function (name) { 
	this.name = name
}

User.prototype.send_message = function (message) {
    this.websocket.write(JSON.stringify(message));
}

var Chat_id = 0
function Chat(line, creator)
{
	this.id = Chat_id++
	this.line = line
	this.user = creator
	this.messages = []
	chats[this.id] = this
}

Chat.prototype.add_message = function (message) { 
	// add the new message to the end of these	
	this.messages.push(message)
}

var Message_id = 0
function Message(user, text) { 
	this.id = Message_id++
	this.user = user
	this.text = text
	messages[this.id] = this
}

exports.Room = Room
exports.Message = Message
exports.Chat = Chat
exports.User = User
exports.users = users
exports.rooms = rooms
exports.messages = messages
exports.chats = chats
