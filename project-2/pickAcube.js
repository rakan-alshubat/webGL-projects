//
// Name: Rakan AlShubat
//

var canvas;
var gl;

var NumVertices  = 36;

var cubeVertices = [];
var cubeColor = [];

//array to store rotation and scale of outer cubes for the center cube to replicate.
var cubeInstance = [];

//theta rotation and increments for the slider
var theta = 0.2;
var inc = 2;

//rotation variable
var rotation;

//to controll cubeInstance[] array
var c = 0;

//model matrix to send to html
var model;

//to controls the scale of the cube. Initialized at 0.2 scale
var cubeScaler = 0.2;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    createCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeColor), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    //sending the model matrix over via uniform
    model = gl.getUniformLocation(program, "model");

    //gets scale slider value
    document.getElementById("cubeScale").oninput = function(){
	cubeScaler = document.getElementById("cubeScale").value;
	cubeScaler = cubeScaler*0.1;
    };

    //gets cube rotation slider value 
    document.getElementById("cubeRotation").oninput = function(){
	inc = document.getElementById("cubeRotation").value;
    };

    //event listener for button to reset
    document.getElementById( "resetCube" ).onclick = function () {
        c = 0;
    };

    // event listener for clicking on canvas
    canvas.addEventListener("mousedown", function(){
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);

	var p = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);

	
	if(0.65 < p[0] && p[0] < 0.95 && -0.2 < p[1] && p[1] < 0.15){
		c = 1;
	} else if(-1.1 < p[0] && p[0] < -0.55 && -0.2 < p[1] && p[1] < 0.15){
		c = 2;
	} else if(-0.1 < p[0] && p[0] < 0.2 && 0.55 < p[1] && p[1] < 0.85){
		c = 3;
	} else if(-0.1 < p[0] && p[0] < 0.2 && -0.95 < p[1] && p[1] < -0.65){
		c = 4;
	} else if(0.3 < p[0] && p[0] < 0.7 && 0.25 < p[1] && p[1] < 0.65){
		c = 5;
	} else if(-0.65 < p[0] && p[0] < -0.25 && 0.25 < p[1] && p[1] < 0.65){
		c = 6;
	} else if(-0.6 < p[0] && p[0] < -0.25 && -0.7 < p[1] && p[1] < -0.4){
		c = 7;
	} else if(0.35 < p[0] && p[0] < 0.7 && -0.7 < p[1] && p[1] < -0.35){
		c = 8;
	}
	
	
    }
    );
        
    render();
}




function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//theta value adjusted for slider value
	theta = theta + inc*0.2;

	//matrices used often are set up here
    	var identity = mat4();
	var trans = translate(-0.5, -0.5, 0.5);
	var scaler = scalem(cubeScaler, cubeScaler, cubeScaler);
	
	var cube;
	
	
    // Right Cube
    rotation = rotate(theta, vec3(1.0, 0.0, 0.0));	

    cube = mult(identity, translate(0.75, 0.0, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[1] = mult(scaler, rotation);

   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    
    // Left Cube
    rotation = rotate(theta, vec3(-1.0, 0.0, 0.0));

    cube = mult(identity, translate(-0.75, 0.0, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[2] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    // Top Cube
    rotation = rotate(theta, vec3(0.0, 1.0, 0.0));

    cube = mult(identity, translate(0.0, 0.75, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[3] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    // Bottom Cube
    rotation = rotate(theta, vec3(0.0, -1.0, 0.0));

    cube = mult(identity, translate(0.0, -0.75, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[4] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    // Top-right Cube
    rotation = rotate(theta, vec3(1.0, 1.0, 0.0));

    cube = mult(identity, translate(0.5, 0.5, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[5] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    // Top-left Cube
    rotation = rotate(theta, vec3(-1.0, 1.0, 0.0));

    cube = mult(identity, translate(-0.5, 0.5, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[6] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    // Bottom-left Cube
    rotation = rotate(theta, vec3(-1.0, -1.0, 0.0));

    cube = mult(identity, translate(-0.5, -0.5, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[7] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    // Bottom-right Cube
    rotation = rotate(theta, vec3(1.0, -1.0, 0.0));

    cube = mult(identity, translate(0.5, -0.5, 0.0));
    cube = mult(cube, scaler);
    cube = mult(cube, rotation);
    cube = mult(cube, trans);

    cubeInstance[8] = mult(scaler, rotation);
   
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );


    //Center Cube
    cube = mult(identity, scaler);
    cubeInstance[0] = cube;

    cube = cubeInstance[c]
    cube = mult(cube, trans);
    gl.uniformMatrix4fv(model, false, flatten(cube));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    



    requestAnimFrame( render );
}