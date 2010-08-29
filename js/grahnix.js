var socket_to_me =null;

Object.prototype.addListener = function(str, callback) { 
	this.addEventListener(str, callback, false)
	return this
}

window.onload = function(){
	restart_processing('codeCanvas', 'codeEditor')
	var canvas = document.getElementById('codeCanvas')
	var run = document.getElementById('run')
	run.addEventListener('click', canvas_blur_handler, false)

	socket_to_me = new WebSocket("ws://localhost:8451")
	socket_to_me
		.addListener('open', function() { 
			console.log("Socket opened")
		})
		.addListener('message', function(message) { 
			console.log("Got message"+message)
			var message = JSON.parse(message)
			switch ( message.type ) { 
				case 'code_update':
				break;
				case 'chat_message':
				break;
				case 'user_entered':
				break;
				case 'error':
				break;
				default:
				break;
			}
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
