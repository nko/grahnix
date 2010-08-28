<!doctype html>
<html>
<head>
   <title>How To Learn</title>
   <script type="text/javascript" src="/js/processing.js"></script>
   <script type="text/javascript" src="/js/grahnix.js"></script>
</head>
<body>

<div id="canvas_box">
	<canvas id="codeCanvas" style="image-rendering: optimizespeed ! important;" height="640" width="480"></canvas>
</div>

<textarea id="codeEditor" rows="40" cols="80">
	void setup() {
		size(250,250);
		frameRate(20);
		strokeWeight(2);
	}

	void draw() {
		background(50);
		stroke(0,156,255);
		line(random(width),random(height),random(width),random(height));
	}
</textarea>

<input id="run" type="button" value="Run Program"/>

</body>

</html>

