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
		size(640,250);
		frameRate(60);
		strokeWeight(40);
	}

    int bgcolor = 0;
    boolean down = false;
	void draw() {
                if (bgcolor == 255) down = true;
                if (bgcolor == 0) down = false;
                 
                if (down) bgcolor--;
                else bgcolor++;

		stroke(bgcolor,bgcolor,bgcolor);
		line(random(width/10),random(height/10),random(width),random(height));
	}
</textarea>

<input id="run" type="button" value="Run Program"/>

</body>

</html>

