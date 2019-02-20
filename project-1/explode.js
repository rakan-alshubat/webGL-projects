//
//CSE 470 HW 1 Explode!  
//
/*
Written by: Rakan Alshubat
Date: Jan 2019

Description: 
This program ..... HW470: COMPLETE THIS. DESCRIBE WHAT YOU DID.
*/

var canvas;
var gl;

//store the vertices
//Each triplet represents one triangle
var vertices = [];

//store a color for each vertex
var colors = [];

//HW470: control the explosion
//(Your variables here)
var explosion = 0.00;
var scalerLoc;

//HW470: control the redraw rate
var delay = 35;

// =============== function init ======================
 
// When the page is loaded into the browser, start webgl stuff
window.onload = function init()
{
	// notice that gl-canvas is specified in the html code
    canvas = document.getElementById( "gl-canvas" );
    
	// gl is a canvas object
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	// Track progress of the program with print statement
    console.log("Opened canvas");
        
    //HW470:
    // Define  data for object 
	// See HW specs for number of vertices and parts required
	// Recommendation: each set of three points corresponds to a triangle.
	// DCH: I have used sval for scaling the object size if I am not
	// happy with my initial design. (Just an idea for you; no need to use.)
	//(During the explosion all geometry must remain in the window.)
    //

    vertices = [
        vec2( 0.20, -0.45 ),
        vec2( -0.30, -0.45 ),
	vec2( -0.05, 0.05 ),
	vec2(0.20, 0.55),
	vec2(-0.30, 0.55),

	vec2( 0.45, 0.30 ),
        vec2( 0.45, -0.20 ),
	vec2( -0.05, 0.05 ),
	vec2(-0.55, 0.30),
	vec2(-0.55, -0.20),

	vec2( 0.20, -0.45 ),
        vec2( 0.45, -0.20 ),
	vec2( -0.05, 0.05 ),
	vec2(-0.55, 0.30),
	vec2(-0.30, 0.55),

	vec2( -0.30, -0.45 ),
        vec2(-0.55, -0.20),
	vec2( -0.05, 0.05 ),
	vec2(0.20, 0.55),
	vec2( 0.45, 0.30 ),

	vec2( 0.20, -0.45 ),
        vec2( -0.30, -0.45 ),
	vec2( -0.05, -0.55),

	vec2(0.20, 0.55),
	vec2(-0.30, 0.55),
	vec2(-0.05,0.65),

	vec2( 0.45, 0.30 ),
        vec2( 0.45, -0.20 ),
	vec2(0.55,0.05),

	vec2(-0.55, 0.30),
	vec2(-0.55, -0.20),
	vec2(-0.65,0.05),

	vec2( 0.20, -0.45 ),
        vec2( 0.45, -0.20 ),
	vec2(0.45,-0.45),

	vec2(-0.55, 0.30),
	vec2(-0.30, 0.55),
	vec2(-0.55,0.55),

	vec2( -0.30, -0.45 ),
        vec2(-0.55, -0.20),
	vec2(-0.55,-0.45),

	vec2(0.20, 0.55),
	vec2( 0.45, 0.30 ),
	vec2(0.45,0.55)
    ];
	 
	
	//HW470: Create colors for the core and outer parts
	// See HW specs for the number of colors needed
	for(var i=0; i < vertices.length; i++) {
		if (i < 20) {
			colors.push(vec3(0.6, 0.4, 1.0)); 
		} else if (i >= 20 && i < 26){
			colors.push(vec3(0.8, 0.0, 0.8));
		} else if (i >= 26 && i < 32){
			colors.push(vec3(0.8, 0.2, 0.4));
		} else if (i >= 32 && i < 38){
			colors.push(vec3(1.0, 0.4, 0.6));
		} else if (i >= 38 && i < 44){
			colors.push(vec3(0.8, 0.4, 1.0));
		}
	};
	 
	 
	
	
	// HW470: Print the input vertices and colors to the console
	console.log("Input vertices and colors:");
	//printing core part
	console.log("Stationary Geometry has the following vertices:");
	for(var j=0; j < 20; j++){
		console.log(vertices[j]);
	};
		console.log("All of which have the same RGB value of: ",colors[0]);
	
	//printing explosion part
	console.log("The outer exploding parts have the following vertices:");
	for(var q=20; q < 44; q++){
		console.log(vertices[q]);
		if ( q == 25 || q == 31 || q == 37 || q == 43){
			console.log("The six vertices above with an RGB value of ", colors[q]);
		}
	};

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
	// Background color to white
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Define shaders to use  
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
	//
	// color buffer: create, bind, and load
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	
	// Associate shader variable for  r,g,b color
	var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // vertex buffer: create, bind, load
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate shader variables for x,y vertices	
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//HW470: associate shader explode variable ("Loc" variables defined here) 
    scalerLoc = gl.getUniformLocation( program, "explosion" );

    console.log("Data loaded to GPU -- Now call render");

    render();
};


// =============== function render ======================

function render()
{
    // clear the screen 
    gl.clear( gl.COLOR_BUFFER_BIT );
	
	//HW470: send uniform(s) to vertex shader
	//expanding factor
	if (explosion < 0.5) {
		explosion += 0.01;
	} else {
		explosion = 0.00;
	}
	
	//HW470: draw the object
	// You will need to change this to create the exploding outer parts effect
	// Hint: you will need more than one draw function call
	
	//stationary uniform (core)
	gl.uniform1f(scalerLoc, 0.0);
	gl.drawArrays( gl.TRIANGLES, 0, 3 );
	gl.drawArrays( gl.TRIANGLES, 2, 3 );
	gl.drawArrays( gl.TRIANGLES, 5, 3 );
	gl.drawArrays( gl.TRIANGLES, 7, 3 );
	gl.drawArrays( gl.TRIANGLES, 10, 3 );
	gl.drawArrays( gl.TRIANGLES, 12, 3 );
	gl.drawArrays( gl.TRIANGLES, 15, 3 );
	gl.drawArrays( gl.TRIANGLES, 17, 3 );

	//exploding uniform
	gl.uniform1f(scalerLoc, explosion);
	gl.drawArrays( gl.TRIANGLES, 20, 3 );
	gl.drawArrays( gl.TRIANGLES, 23, 3 );
	gl.drawArrays( gl.TRIANGLES, 26, 3 );
	gl.drawArrays( gl.TRIANGLES, 29, 3 );
	gl.drawArrays( gl.TRIANGLES, 32, 3 );
	gl.drawArrays( gl.TRIANGLES, 35, 3 );
	gl.drawArrays( gl.TRIANGLES, 38, 3 );
	gl.drawArrays( gl.TRIANGLES, 41, 3 );	

	//re-render after delay
	setTimeout(function (){requestAnimFrame(render);}, delay);
}

