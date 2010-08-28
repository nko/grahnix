window.onload = function()
{
	restart_processing('codeCanvas', 'codeEditor')
	var canvas = document.getElementById('codeCanvas')
	var run = document.getElementById('run');
	run.addEventListener('click', canvas_blur_handler, false);
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
