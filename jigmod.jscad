/*
 * params
 *  holeDiameter: hole diameter in mm; default: 3
 *  plateX: width of the plate in mm; default: 60
 *  plateY: length of the plate in mm; default :30
 *  allowHalfHoles: 'yes'/'no'; whether mounting holes can be on the edge of the plate; default: 'yes'
 *
 *  use wallThickness global setting, or 0.5 by default
 *
*/
jigmod = function(params)
{
    var holeSpacingX = 30;
    var holeSpacingY = 10;
    var holePaddingX = 15;
    var holePaddingY = 4;

    wallThickness = wallThickness || 0.5;

    var holeDiameter = params && params.holeDiameter || 3;
    var allowHalfHoles = params && params.allowHalfHoles || 'yes';
    var plateX = params && params.plateX && params.plateX > 0 && params.plateX || 60;
    var plateY = params && params.plateY && params.plateY > 0 && params.plateY || 30;
    var plateThickness = params && params.thickness && params.thickness > 0 && params.thickness || 5;
    var plateCornerFillet = 6;

    var plateOutline = CAG.roundedRectangle({
            center: [plateX / 2, plateY / 2],
            radius: [plateX / 2, plateY / 2],
            roundradius: plateCornerFillet / 2,
            resolution: 32
        });
    var plate = plateOutline.extrude({
            offset: [0,0,plateThickness],
            center: false
        })

    var hole = CSG.cylinder({                      // object-oriented
            start: [0, 0, 0],
            end: [0, 0, plateThickness + 2],
            radius: holeDiameter / 2,                        // true cylinder
            resolution: 32
        });
    var holeExtent = holeDiameter / 2;
    holePaddingX = plateCornerFillet;
    holePaddingY = 0;
    if ( allowHalfHoles === 'no' )
    {
        holeExtent = 0;
        holePaddingX = holeDiameter + wallThickness;
        holePaddingY = holeDiameter + wallThickness;
    }
    var holeX = holePaddingX;
    var holeY = holePaddingY;

    var holeArray;
    var holeStartX;
    var holeStartY;
    var holeEndX;
    var holeEndY;

    var plateYExtent = plateY + holeExtent;
    var plateXExtent = plateX + holeExtent;

    while ( holeX < plateXExtent )
    {
        holeY = holePaddingY;
        while ( holeY < plateYExtent )
        {
            // only do the first and last rows
            if ( holeY == holePaddingY )
            {
                if ( !holeArray )
                {
                    holeArray = hole.translate([holeX, holeY, 0]);
                    holeStartY = holeY;
                    holeStartX = holeX;
                }
                else
                {
                    holeArray = holeArray.union(hole.translate([holeX, holeY, 0]));
                }
            }
            else if ( ( holeY + holeSpacingY ) >= plateYExtent )
            {
                holeArray = holeArray.union(hole.translate([holeX, holeY, 0]));
                holeEndY = holeY;
                holeEndX = holeX;
            }

            holeY = holeY + holeSpacingY;
        }
        holeX = holeX + holeSpacingX;
    }
    // center the whole hole array
    var holesWidth = holeEndX - holeStartX;
    var holesLength = holeEndY - holeStartY;
    var holeCenterX = ( plateX - holesWidth ) / 2;
    var holeCenterY = ( plateY - holesLength ) / 2;

    holeArray = holeArray.translate([holeCenterX - holeStartX, holeCenterY - holeStartY, 0]);
    plate = plate.subtract(holeArray);

    return plate;
}
