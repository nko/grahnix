Object.prototype.addListener = function(str, callback) { 
	this.addEventListener(str, callback, false)
	return this
}

function process_message(message, socket) { 
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

	var socket_to_me = new WebSocket("ws://localhost:8451")
	socket_to_me
		.addListener('open', function() { 
			console.log("Socket opened")
		})
		.addListener('message', function(message) { 
			console.log("Got message"+message)
			var message = JSON.parse(message)
			process_message(message, socket_to_me);
		})
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
