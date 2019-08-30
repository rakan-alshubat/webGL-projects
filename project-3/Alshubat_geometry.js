// Name: Rakan Alshubat

//Discretization & Rotation
var disc = 60;
var rot = 90;

//Initialize vertex counnt of the two shapes
let cylinderCount = 0;
let vaseCount = 0;

//initializing arrays
var pointsArray = [];
var normalsArray = [];



function createCylinder(){
    for(let t = 1; t > -1; t -= 2/disc) {
        //create the 2d line vector
        let genaretrix = vec4(1, t, 0, 1)

        let x = 1
        let z = 0

        //create the circle about each point
        for(let theta=0; theta < 360; theta += 360/rot){

            x = ( Math.cos(radians(1)) * x ) + ( -Math.sin(radians(1)) * z )
            z = ( Math.sin(radians(1)) * x ) + ( Math.cos(radians(1)) * z )


            pointsArray.push(x)
            pointsArray.push(t)
            pointsArray.push(z)

            normalsArray.push(x)
            normalsArray.push(t)
            normalsArray.push(z)

            cylinderCount++
        }



    }

}



function createVase(){
    for(let t = 1; t > -1; t -= 2/disc ) {
        //create the 2d line vector
        let genaretrix = vec4(0.25 * Math.sin(-1 * t * Math.PI) + 0.5, t, 0, 1)

        let x = 0.25 * Math.sin(-1 * t * Math.PI) + 0.5
        let z = 0

        //create the circle about each point
        for(let theta=0; theta < 360; theta += 360/rot){

            x = ( Math.cos(radians(1)) * x ) + ( -Math.sin(radians(1)) * z )
            z = ( Math.sin(radians(1)) * x ) + ( Math.cos(radians(1)) * z )

            pointsArray.push(x)
            pointsArray.push(t)
            pointsArray.push(z)

            normalsArray.push(x)
            normalsArray.push(t)
            normalsArray.push(z)



            vaseCount++
        }

    }


}