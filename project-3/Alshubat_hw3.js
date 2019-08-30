
// Name: Rakan Alshubat

var canvas;
var gl;

var numTimesToSubdivide = 3;

var index = 0;

var fixedPos = true

var eye = vec3(0.0, 0.0, 3.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

//init eye on z-axis
var radius = 1.5;
var theta  = 0.0;
var phi    = Math.PI / 2.0;
var dr = 10.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var mouse =
	{
		prevX: 0,
		prevY: 0,

		leftDown: false,
		rightDown: false,
	};

var perspProj =
	{
		fov: 60,
		aspect: 1,
		near: 2.0,
		far:  10
	}


var x = 1.0;
var y = 1.0;


var va = vec3(0.0, 0.0, -1.0);
var vb = vec3(0.0, 0.942809, 0.333333);
var vc = vec3(-0.816497, -0.471405, 0.333333);
var vd = vec3(0.816497, -0.471405, 0.333333);


var lightPosition = vec4(1.0, 1.0, -3.0, 1.0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );


var materialAmbient = vec4( 0.25, 0.20725, 0.20725, 1.0 );
var materialDiffuse = vec4( 1.0, 0.829, 0.829, 1.0);
var materialSpecular = vec4( 0.296648, 0.296648, 0.296648, 1.0 );

var materialShininess = 11.264;


//initializing object visability
// default is cylinder
var cylinder = true
var vase = false


var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

function triangle(a, b, c) {

	normalsArray.push(a);
	normalsArray.push(b);
	normalsArray.push(c);

	pointsArray.push(a);
	pointsArray.push(b);
	pointsArray.push(c);

	index += 3;
}


function divideTriangle(a, b, c, count) {
	if ( count > 0 ) {

		var ab = mix( a, b, 0.5);
		var ac = mix( a, c, 0.5);
		var bc = mix( b, c, 0.5);

		// normalize 3d vector
		ab = normalize(ab, false);
		ac = normalize(ac, false);
		bc = normalize(bc, false);

		divideTriangle( a, ab, ac, count - 1 );
		divideTriangle( ab, b, bc, count - 1 );
		divideTriangle( bc, c, ac, count - 1 );
		divideTriangle( ab, bc, ac, count - 1 );
	}
	else {
		triangle( a, b, c );
	}
}


function tetrahedron(a, b, c, d, n) {
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

window.onload = function init() {

	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.3137, 0.3137, 0.3137, 1.0 );

	gl.enable(gl.DEPTH_TEST);


	//
	//  Load shaders and initialize attribute buffers
	//
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );


	//Changing the material
	document.getElementById("pearl").onclick = function(){
		materialAmbient = vec4( 0.25, 0.20725, 0.20725, 1.0 );
		materialDiffuse = vec4( 1.0, 0.829, 0.829, 1.0);
		materialSpecular = vec4( 0.296648, 0.296648, 0.296648, 1.0 );
		materialShininess = 11.264;
		console.log("pearl");
	}
	document.getElementById("chrome").onclick = function(){
		materialAmbient = vec4( 0.25, 0.25, 0.25, 1.0 );
		materialDiffuse = vec4( 0.4, 0.4, 0.4, 1.0);
		materialSpecular = vec4( 0.774597, 0.774597, 0.774597, 1.0 );
		materialShininess = 76.8;
		console.log("chrome");
	}
	document.getElementById("gold").onclick = function(){
		materialAmbient = vec4( 0.24725, 0.1995, 0.0745, 1.0 );
		materialDiffuse = vec4( 0.75164, 0.60648, 0.22648, 1.0);
		materialSpecular = vec4( 0.628281, 0.555802, 0.366065, 1.0 );
		materialShininess = 51.2;
		console.log("gold");
	}

	//changing the field of view
	document.getElementById("fov").oninput = function(){
		perspProj.fov = document.getElementById("fov").value;
	}

	tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
	createCylinder();
	createVase();



	var nBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

	var vNormal = gl.getAttribLocation( program, "vNormal" );
	gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vNormal);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
	projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program, "specularProduct");
	shininessLoc = gl.getUniformLocation(program, "shininess");
	lightPositionLoc = gl.getUniformLocation( program, "lightPosition")




	document.getElementById("cylinder").onclick = function(){
		vase = false
		cylinder = true
	};
	document.getElementById("vase").onclick = function(){
		cylinder = false
		vase = true
	};



	// ========================== Camera control via mouse ============================================
	// There are 4 event listeners: onmouse down, up, leave, move
	//
	// on onmousedown event
	// check if left/right button not already down
	// if just pressed, flag event with mouse.leftdown/rightdown and stores current mouse location
	document.getElementById("gl-canvas").onmousedown = function (event)
	{
		if(event.button == 0 && !mouse.leftDown)
		{
			mouse.leftDown = true;
			mouse.prevX = event.clientX;
			mouse.prevY = event.clientY;
		}
		else if (event.button == 2 && !mouse.rightDown)
		{
			mouse.rightDown = true;
			mouse.prevX = event.clientX;
			mouse.prevY = event.clientY;
		}
	};

	// onmouseup event
	// set flag for left or right mouse button to indicate that mouse is now up
	document.getElementById("gl-canvas").onmouseup = function (event)
	{
		// Mouse is now up
		if (event.button == 0)
		{
			mouse.leftDown = false;
		}
		else if(event.button == 2)
		{
			mouse.rightDown = false;
		}

	};

	// onmouseleave event
	// if mouse leaves canvas, then set flags to indicate that mouse button no longer down.
	// This might not actually be the case, but it keeps input from the mouse when outside of app
	// from being recorded/used.
	// (When re-entering canvas, must re-click mouse button.)
	document.getElementById("gl-canvas").onmouseleave = function ()
	{
		// Mouse is now up
		mouse.leftDown = false;
		mouse.rightDown = false;
	};

	// onmousemove event
	// Move the camera based on mouse movement.
	// Record the change in the mouse location
	// If left mouse down, move the eye around the object based on this change
	// If right mouse down, move the eye closer/farther to zoom
	// If changes to eye made, then update modelview matrix

	document.getElementById("gl-canvas").onmousemove = function (event)
	{
		// only record changes if mouse button down
		if (mouse.leftDown || mouse.rightDown) {

			// Get changes in x and y at this point in time
			var currentX = event.clientX;
			var currentY = event.clientY;

			// calculate change since last record
			var deltaX = event.clientX - mouse.prevX;
			var deltaY = event.clientY - mouse.prevY;


			// Compute camera rotation on left click and drag
			if (mouse.leftDown)
			{

				// Perform rotation of the camera
				//
				if (up[1] > 0)
				{
					theta += 0.01 * deltaX;
					phi -= 0.01 * deltaY;
				}
				else
				{
					theta += 0.01 * deltaX;
					phi -= 0.01 * deltaY;
				}

				// Wrap the angles
				var twoPi = 6.28318530718;
				if (theta > twoPi)
				{
					theta -= twoPi;
				}
				else if (theta < 0)
				{
					theta += twoPi;
				}

				if (phi > twoPi)
				{
					phi -= twoPi;
				}
				else if (phi < 0)
				{
					phi += twoPi;
				}

			} // end mouse.leftdown
			else if(mouse.rightDown)
			{

				// Perform zooming; don't get too close
				radius -= 0.01 * deltaX;
				radius = Math.max(0.1, radius);
			}


			// Recompute eye and up for camera
			var threePiOver2 = 4.71238898;
			var piOver2 = 1.57079632679;
			var pi = 3.14159265359;

			//console.log("viewer.radius = ",viewer.radius);

			// pre-compute this value
			var r = radius * Math.sin(phi + piOver2);

			// eye on sphere with north pole at (0,1,0)
			// assume user init theta = phi = 0, so initialize to pi/2 for "better" view

			eye = vec3(r * Math.cos(theta + piOver2), radius * Math.cos(phi + piOver2), r * Math.sin(theta + piOver2));

			//add vector (at - origin) to move
			for(k=0; k<3; k++)
				eye[k] = eye[k] + at[k];


			// modify the up vector
			// flip the up vector to maintain line of sight cross product up to be to the right
			// true angle is phi + pi/2, so condition is if angle < 0 or > pi

			if (phi < piOver2 || phi > threePiOver2) {
				up = vec3(0.0, 1.0, 0.0);
			}
			else {
				up = vec3(0.0, -1.0, 0.0);
			}

			// Recompute the view
			mvMatrix = lookAt(vec3(eye), at, up);


			mouse.prevX = currentX;
			mouse.prevY = currentY;





		} // end if button down

	};




	document.getElementById("fixed").onclick = function(){
		fixedPos = true;
	}
	document.getElementById("rotating").onclick = function(){
		fixedPos = false;
	}

	render();
}


function render() {

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
		radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

	ambientProduct = mult(lightAmbient, materialAmbient);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	specularProduct = mult(lightSpecular, materialSpecular);

	if(fixedPos){
		gl.uniform4fv(lightPositionLoc, flatten(lightPosition))
	}else{
		x = ( Math.cos(radians(1)) * x ) + ( -Math.sin(radians(1)) * y )
		y = ( Math.sin(radians(1)) * x ) + ( Math.cos(radians(1)) * y )

		lightPosition = vec4(x, y, -3.0, 0.0)

		gl.uniform4fv(lightPositionLoc, flatten(lightPosition))
	}



	modelViewMatrix = lookAt(eye, at , up);
	projectionMatrix = perspective(perspProj.fov, perspProj.aspect, perspProj.near, perspProj.far);


	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniform4fv(ambientProductLoc, flatten(ambientProduct))
	gl.uniform4fv(diffuseProductLoc, flatten(diffuseProduct))
	gl.uniform4fv(specularProductLoc, flatten(specularProduct))
	gl.uniform1f(shininessLoc, materialShininess)

	//i left this in to show that everything else is working, but i couldnt figure out SORs
	for( var i=0; i<index; i+=3)
		gl.drawArrays( gl.TRIANGLES, i, 3 );


	if(cylinder){
		gl.drawArrays(gl.TRIANGLES, index+1, cylinderCount)
	}

	if(vase){
		gl.drawArrays(gl.TRIANGLES, index+cylinderCount+1, vaseCount)
	}









	modelViewMatrix = mat4()
	modelViewMatrix = mult(modelViewMatrix, translate(x*2, y*2, -4.0))
	modelViewMatrix = mult(modelViewMatrix, scalem(0.1, 0.1, 0.0))

	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniform4fv(ambientProductLoc, flatten(vec4(1.0, 1.0, 1.0, 1.0)))
	gl.uniform4fv(diffuseProductLoc, flatten(vec4(1.0, 1.0, 1.0, 1.0)))
	gl.uniform4fv(specularProductLoc, flatten(vec4(1.0, 1.0, 1.0, 1.0)))

	for( var i=0; i<index; i+=3)
		gl.drawArrays( gl.TRIANGLES, i, 3 );

	window.requestAnimFrame(render);
}
