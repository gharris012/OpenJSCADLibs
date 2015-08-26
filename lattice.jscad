// author: gharris012
// description: make a latticed(?) wall

/*
var wallThickness = 1.0;
var wallHeight = 25; // x
var wallLength = 64; // y

var sparSize = 0.5;
var sparAngle = 30;
//var sparSpace = 30;
var sparCount = 3; // how many spars along wallHeight
//var sparSpace = wallHeight/sparCount;

var trimSpar;


var showAxis = true;

*/

makeBorder = function (vec)
{
    var dvec = [
        vec[0]/2,
        vec[1]/2,
        vec[2]/2
    ];
    var shell=CSG.cube({radius: dvec});
    var inner=CSG.cube({radius: [dvec[0]-vec[3], dvec[1]-vec[3], dvec[2]]});

    return shell.subtract(inner);
}

makeTrimSpar = function (width,length,thickness)
{
    var vec = [width, length, thickness];
    var dvec = [
        vec[0]/2,
        vec[1]/2,
        vec[2]/2
    ];
    return CSG.cube({radius: [dvec[0]-dvec[2], dvec[1]-dvec[2], dvec[2]]});
}

makeSpar = function (size, thickness, rot, xh, yh)
{
    var hyp = ( ( Math.sqrt(Math.pow(xh, 2) + Math.pow(yh, 2)) ) / 2 );
    hyp = ( hyp <=0 ? 1 : hyp );
    var spar = rotate(rot, [0,0,1], CSG.cube({radius: [size/2, thickness/2, hyp]})
                    .translate([size/2, thickness/2, -hyp])
                    .rotateX(90));
    return spar;
}

lattice = function (width,length,size,thickness,angle,count,xOffset,yOffset)
{
    var deg2rad = Math.PI/180;
    var rad2deg = 180/Math.PI;

    var retval = [];
    var border = makeBorder([width, length, thickness, size]).translate([width/2,length/2,thickness/2]);
    retval.push(border);
    var trimSpar = makeTrimSpar(width,length,thickness).translate([width/2,length/2,thickness/2]);

    var space = length / count;

    xOffset = xOffset || 0;
    yOffset = yOffset || 0;

    var xStart = xOffset;
    var xFinish = width + space;

    var spars = [];
    var spar;
    var yMv = 0;
    var ny = 0;
    var nx = 0;
    var yh = 0;
    var xh = 0;
    var ySpace = Math.tan((90-angle) * deg2rad) * space;
    var yTotal = length + ( Math.tan((90-angle) * deg2rad) * width );

    sparSpace = ySpace;

    for ( xMv = xStart ; xMv < xFinish || yMv < yTotal ; xMv = xMv + space )
    {
        nx = ( xMv >= xFinish ? nx : xMv );
        xh = nx;
        ny = ( xMv >= xFinish ? ny + ySpace : 0 );
        yh = ( xMv >= xFinish ? yh : yMv );
        //echo("nx",nx,"ny",ny);

        spars.push(makeSpar(size, thickness, angle, xh, yh).translate([nx,ny,0]));

        yMv += ySpace;
    }
    retval.push(union(spars).intersect(trimSpar));

    spars = [];
    yMv = 0;
    ny = 0;
    nx = 0;
    yh = 0;
    xh = 0;
    xStart = width;
    xFinish = 0-space;
    for ( xMv = xStart ; xMv > xFinish || yMv < yTotal ; xMv = xMv - space )
    {
        nx = ( xMv <= xFinish ? nx : xMv );
        xh = ( xMv <= xFinish ? xh : width - xMv );
        ny = ( xMv <= xFinish ? ny + ySpace : 0 );
        yh = ( xMv <= xFinish ? yh : yMv );
        //echo("-nx",nx,"-ny",ny,"-xh",xh,"-yh",yh);

        spars.push(makeSpar(size, thickness, -angle, xh, yh).translate([nx,ny,0]));

        yMv += ySpace;
    }
    retval.push(union(spars).intersect(trimSpar));

    return union(retval);
}

/*
function main()
{
    var output = [];

    output.push(lattice(wallLength,wallHeight,sparSize,wallThickness,sparAngle,sparCount));

    return output;
}
*/
