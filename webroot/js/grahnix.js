Object.prototype.addListener = function(str, callback) { 
	this.addEventListener(str, callback, false)
	return this
}

function process_message(message, socket) { 
    update_chats(message.chats);

	if (message.users) { 
		}
	if (message.chat) { 
		$("#chat_"+chat.id)	
	}
	if (message.code_update) { 

	}
	if (message.user) { 
		
	}
}

window.onload = function(){
	restart_processing('codeCanvas', 'codeEditor')
	var canvas = document.getElementById('codeCanvas')
	var run = document.getElementById('run')
	run.addEventListener('click', canvas_blur_handler, false)

	socket_to_me = new WebSocket("ws://127.0.0.1:8451")
	socket_to_me
		.addListener('open', function() { 
			console.log("Socket opened")
            // TODO add explicit join room 
            send_message({type:"join_room",username:"tester"});
		})
		.addListener('message', function(message) { 
			var message = JSON.parse(message.data)
			console.log("Got message"+message)
			process_message(message, socket_to_me);
		})
}

$(document).ready(function(){
    $("#chatline").keydown(function(event){
        if (event.keyCode == 13) {
            var text=$("#chatline").val();
            if(text.length > 0){
                send_message({type:"chat_message",message:text});
            }
            $("#chatline").val("");
        }
    });
});

function update_chats(chats){
    for(var i=0;i<chats.length;i++){
        $("#chatter").append(chats[i].user+": "+chats[i].text+"<br/>");
    }
    $("#chatter").attr({ scrollTop: $("#chatter").attr("scrollHeight") });
}

function send_message(msg){
    socket_to_me.send(JSON.stringify(msg));
}

function canvas_blur_handler(e) { 
	restart_processing('codeCanvas', 'codeEditor')
}

function restart_processing(canvas_id, code_source) { 
	var canvas = document.getElementById(canvas_id)
	var code = document.getElementById(code_source).value
	try { 
		Processing(canvas, code)
	} catch (e) { 
		alert(e);
	}
}
