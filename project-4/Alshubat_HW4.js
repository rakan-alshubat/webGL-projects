//
//Name: Rakan Alshubat
//

var canvas;
var gl;
var program;

var projectionMatrix; 
var modelViewMatrix;

var instanceMatrix;

var texture;
var texSize = 64;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var zAnim = 0;
var zFactor = 0.1;

var animToggle = true;

var xAnim = 0;
var xFactor = -0.1

var modelViewMatrixLoc;
var colorLoc;

var normal = vec4(0.0, 1.0, 0.0, 0.0);
var tangent = vec3(1.0, 0.0, 0.0);

// demo: change 1,1 tex coord to 0.5, 0.5 
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1,1),
    vec2(1, 0)
];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var lightPosition = vec4(1.0, 1.0, -3.0, 1.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 11;


var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftInnerWingId = 2;
var leftOuterWingId = 3;
var rightinnerWingId = 4;
var rightOuterWingId = 5;
var innerTailId = 6;
var outerTailId = 7;

var innerWingFactor = 1;
var outerWingFactor = 1;
var tailFactor = 0.5;
var tailMov = 0;

var tailMov2 = 0;
var tailFactor2 = -0.1;


var torsoHeight = 5.0;
var torsoWidth = 5.0;
var innerWingHeight = 1.0;
var outerWingHeight = 1.0;
var innerWingWidth  = 10.0;
var outerWingWidth  = 10.0;
var innerTailWidth  = 0.5;
var outerTailWidth  = 0.5;
var outerTailHeight = 2.0;
var innerTailHeight = 3.0;
var headHeight = 2;
var headWidth = 1;


var numNodes = 8;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 0, -20, 0, 20, 180, 0, 180, 0, 0];

var numVertices  = 36;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

//-------------------------------------------

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
 }
 
//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
    
    case torsoId:
    
    m = translate(xAnim, torsoHeight, zAnim)
    //m = rotate(theta[torsoId], 0, 1, 0 );
    m = mult(m, rotate(theta[torsoId], 0, 1, 0 ));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId: 
    
    

	//DCH Comment: I think there is an error in the head
	// I have commented out the code that is not needed. We want the head to rotate about a point in base, not center
	
    //m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = translate(0.0, torsoHeight, 0.0);
	m = mult(m, rotate(theta[headId], 1, 0, 0))
    //m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftInnerWingId, null);
    break;
    
    
    case leftInnerWingId:
    
    m = rotateZ(theta[leftInnerWingId]);
    //m = translate(-(torsoWidth+innerWingWidth), 0.9*torsoHeight, 0.0);
	m = mult(m, translate(-(torsoWidth+innerWingWidth), 0.9*torsoHeight, 0.0));
    figure[leftInnerWingId] = createNode( m, leftInnerWing, rightinnerWingId, leftOuterWingId );
    break;

    case rightinnerWingId:
    
    m = rotateZ(theta[rightinnerWingId]);
    //m = translate(torsoWidth+innerWingWidth, 0.9*torsoHeight, 0.0);
	m = mult(m, translate(torsoWidth+innerWingWidth, 0.9*torsoHeight, 0.0));
    figure[rightinnerWingId] = createNode( m, rightinnerWing, innerTailId, rightOuterWingId );
    break;
    
    case innerTailId:
    
    m = translate(-(torsoWidth+innerTailWidth), tailMov + 0.1*innerTailHeight-4.5, 0.0);
	m = mult(m , rotate(theta[innerTailId]+45+tailMov, 1, 0, 0));
    figure[innerTailId] = createNode( m, innerTail, null, outerTailId );
    break;
    
    case leftOuterWingId:

    m = rotateZ(theta[leftOuterWingId])
    //m = translate(0.0, innerWingHeight, 0.0);
    m = mult(m, translate(0.0, innerWingHeight, 0.0));
    figure[leftOuterWingId] = createNode( m, leftOuterWing, null, null );
    break;
    
    case rightOuterWingId:

    m = rotateZ(theta[rightOuterWingId]);
    //m = translate(0.0, innerWingHeight, 0.0);
    m = mult(m, translate(0.0, innerWingHeight, 0.0));
    figure[rightOuterWingId] = createNode( m, rightOuterWing, null, null );
    break;
    
    case outerTailId:

    m = translate(0.0, innerTailHeight, 0.0);
    m = mult(m, rotate(theta[outerTailId]+tailMov, 1, 0, 0));
    figure[outerTailId] = createNode( m, outerTail, null, null );
    break;
    
    }

}

function traverse(Id) {
   
    if(Id == null) return; 
    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if(figure[Id].child != null) traverse(figure[Id].child); 
     modelViewMatrix = stack.pop();
    if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
 }

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight+tailMov, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth*2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.3, 0.3, 0.3, 1.0)) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight+tailMov, torsoWidth ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth*2, headHeight, headWidth*3) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.1, 0.1, 0.1, 1.0)) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function leftInnerWing() {

    instanceMatrix = mult(modelViewMatrix, translate(9.5, -0.5 * innerWingHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(innerWingWidth, innerWingHeight, innerWingWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.6, 0.6, 0.6, 1.0)) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function leftOuterWing() {

    instanceMatrix = mult(modelViewMatrix, translate(0, -1.5 * outerWingHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(outerWingWidth, outerWingHeight, outerWingWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.6, 0.6, 0.6, 1.0)) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function rightinnerWing() {

    instanceMatrix = mult(modelViewMatrix, translate(-9.5, -0.5 * innerWingHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(innerWingWidth, innerWingHeight, innerWingWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.6, 0.6, 0.6, 1.0)) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function rightOuterWing() {

    instanceMatrix = mult(modelViewMatrix, translate(0, -1.5 * outerWingHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(outerWingWidth, outerWingHeight, outerWingWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.6, 0.6, 0.6, 1.0)) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function  innerTail() {

    instanceMatrix = mult(modelViewMatrix, translate(5.5, 0.5 * innerTailHeight, torsoWidth*1.5) );
	instanceMatrix = mult(instanceMatrix, scale4(innerTailWidth, innerTailHeight, innerTailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.3, 0.3, 0.3, 1.0)) );
	gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}

function outerTail() {
    
    instanceMatrix = mult(modelViewMatrix, translate( 5.5, 0.5 * outerTailHeight, torsoWidth*1.5) );
	instanceMatrix = mult(instanceMatrix, scale4(outerTailWidth, outerTailHeight, outerTailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, flatten(vec4(0.3, 0.3, 0.3, 1.0)) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}




function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); 
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]); 
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]); 
     texCoordsArray.push(texCoord[2]); 
   
     pointsArray.push(vertices[a]); 
     texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]); 
     texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]); 
     texCoordsArray.push(texCoord[3]);   
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function mat4Tomat3(mat) {
	a = mat3();
	for(var i=0; i<3; i++) {
		for(var j=0; j<3; j++) {
			a[i][j] = mat[i][j];
		}
	}
	return a;
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.68, 0.8, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    instanceMatrix = mat4();
    
    
    projectionMatrix = perspective(60, 1, -10.0, 10.0);
    modelViewMatrix = lookAt(vec3(0.0, 0.0, 50.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 10.0, 0.0));

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix) );

    
    var normalMatrix = mat4Tomat3(modelViewMatrix);
    gl.uniformMatrix3fv( gl.getUniformLocation(program, "normalMatrix"), false, flatten(normalMatrix));

    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
	specularProductLoc = gl.getUniformLocation(program, "specularProduct");
	shininessLoc = gl.getUniformLocation(program, "shininess");
    lightPositionLoc = gl.getUniformLocation( program, "lightPosition")
    
    gl.uniform4fv(ambientProductLoc, flatten(lightAmbient))
	gl.uniform4fv(diffuseProductLoc, flatten(lightDiffuse))
    gl.uniform4fv(specularProductLoc, flatten(lightSpecular))
    gl.uniform4fv(lightPositionLoc, flatten(lightPosition))
    gl.uniform1f(shininessLoc, materialShininess)
    
    modeLoc = gl.getUniformLocation(program, "mode");

    colorLoc = gl.getUniformLocation(program, "color");

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    //
    // Initialize a texture
    //

    var image = new Image();
	image.src = "ground.JPEG"
	
    image.onload = function() { 
        configureTexture( image );
    }

    document.getElementById("toggle").onclick = function(){
		animToggle = !animToggle
	};

    
    for(i=0; i<numNodes; i++) initNodes(i);

       
    render();
 
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    instanceMatrix = mult(modelViewMatrix, translate(0.0, -20, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(75, outerTailHeight, 400) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform1i(modeLoc, 2)
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    gl.uniform1i(modeLoc, 1)

    if (animToggle){
    if (zAnim >= 25){
        zFactor = -0.1;
        
    }
    if (zAnim <= -25){
        zFactor = 0.1
    }
    zAnim = zAnim + zFactor

    if (xAnim >= 10){
        xFactor = -0.1;
        
    }
    if (xAnim <= -10){
        xFactor = 0.1
    }
    xAnim = xAnim + xFactor

    if (theta[leftInnerWingId] == 25){
        innerWingFactor = -1;
        
    }
    if (theta[leftInnerWingId] == -25){
        innerWingFactor = 1
    }
    theta[leftInnerWingId] = theta[leftInnerWingId] + innerWingFactor
    theta[rightinnerWingId] = theta[rightinnerWingId] - innerWingFactor
    initNodes(leftInnerWingId)
    initNodes(rightinnerWingId)

    if (theta[leftOuterWingId] == 25){
        outerWingFactor = -1;
        
    }
    if (theta[leftOuterWingId] == -25){
        outerWingFactor = 1
        
    }
    theta[leftOuterWingId] = theta[leftOuterWingId] + outerWingFactor
    theta[rightOuterWingId] = theta[rightOuterWingId] - outerWingFactor
    initNodes(leftOuterWingId)
    initNodes(rightOuterWingId)

    if (tailMov >= 1){
        tailFactor = -0.04; 
    }
    if (tailMov <= -1){
        tailFactor = 0.04
    }
    tailMov = tailMov + tailFactor

    if (tailMov2 >= 1){
        tailFactor2 = -0.1; 
    }
    if (tailMov2 <= -1){
        tailFactor2 = 0.1
    }
    tailMov2 = tailMov2 + tailFactor2
    theta[headId] = theta[headId] + tailMov2
    initNodes(innerTailId)

    initNodes(outerTailId)
    initNodes(headId)
    initNodes(torsoId)
}
        
    traverse(torsoId);
    requestAnimFrame(render);
}
