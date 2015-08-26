// args.type
// args.fit
// args.length
screw = function(type, args)
{
    var types = {
        "#4-40": {
            "Name": "#4-40",
            "fit": { // clearance and tap drill sizes (mostly from: http://www.csgnetwork.com/screwnummachtable.html)
                     // do not add tolerance
                "free": 3.3,
                "close": 3.0,
                "nominal": 2.7, // diameter including threads as measured using calipers
                "tap": 2.30
            },
            "defaultLength": 6.0,
            "defaultFit": "free"
        },
        "M2.5": {
            "Name": "M2.5",
            "fit": { // clearance and tap drill sizes (mostly from: http://www.csgnetwork.com/screwmetmachtable.html)
                     // do not add tolerance
                "free": 3.1,
                "close": 2.7,
                "nominal": 5.80, // diameter including threads as measured using calipers
                "tap": 2.15
            },
            "defaultLength": 6.0,
            "defaultFit": "free"
        },
        "M6": {
            "Name": "M6",
            "fit": { // clearance and tap drill sizes (mostly from: http://www.csgnetwork.com/screwmetmachtable.html)
                     // do not add tolerance
                "free": 7.0,
                "close": 6.4,
                "nominal": 5.80, // diameter including threads as measured using calipers
                "tap": 5.00
            },
            "defaultLength": 20.0,
            "defaultFit": "free"
        }

    };
    this.type = types[type];
    this.length = args && args.length || this.type["defaultLength"];
    this.fit = args && args.fit || this.type.defaultFit;
    this.diameter = this.type.fit[this.fit];

    this.screw = function ()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.length],
                    radius: this.diameter / 2
                });
    }

    this.roundPost = function (wallThickness, length)
    {
        wallThickness = wallThickness || 2;
        length = length || this.length;
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,length],
                    radius: ( this.diameter / 2 ) + wallThickness
                }).subtract(this.hole());
    }

    this.squarePost = function (wallThickness, length)
    {
        wallThickness = wallThickness || 2;
        length = length || this.length;
        return CSG.cube({
                    start: [0,0,0],
                    radius: [( this.diameter / 2 ) + wallThickness, ( this.diameter / 2 ) + wallThickness, length / 2 ]
                }).subtract(this.hole().translate([0,0,-length/2]));
    }

    this.hole = function (args)
    {
        var fit = args && args.fit || this.fit;
        var length = args && args.length || this.length;
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,length],
                    radius: ( this.type.fit[fit] ) / 2
                });
    }
}

washer = function(type, args)
{
    var types = {
        "M6": {
            "Name": "M6",
            "diameter": 12.0,
            "height": 1.0,
            "screw": "M6"
        }
    };
    this.type = types[type];
    this.diameter = this.type.diameter;
    this.height = this.type.height;

    this.screw;
    if ( args && typeof(args.screw) != 'undefined' )
    {
        if ( typeof(args.screw) == 'object' )
        {
            this.screw = args.screw;
        }
        else
        {
            this.screw = new screw(args.screw);
        }
    }
    else
    {
        this.screw = new screw(this.type.screw);
    }

    this.nut;
    if ( args && typeof(args.nut) != 'undefined' )
    {
        if ( typeof(args.nut) == 'object' )
        {
            this.nut = args.nut;
        }
        else
        {
            this.nut = new nut(args.nut);
        }
    }
    else
    {
        this.nut = new nut(this.type.screw);
    }

    this.getRecessHeight = function()
    {
        return this.height + this.nut.height;
    }

    this.washer = function()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height],
                    radius: this.diameter / 2
                }).subtract(this.screw.hole())
    }

    this.hole = function(tolerance)
    {
        tolerance = tolerance || tol;
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height + tolerance],
                    radius: ( this.diameter + tolerance ) / 2
                });
    }

    this.recess = function(tolerance)
    {
        tolerance = tolerance || tol;
        height = this.getRecessHeight()

        this.recessHeight = height;

        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,height + tolerance],
                    radius: ( this.diameter + tolerance ) / 2
                });
    }
}

nut = function(type, args)
{
    var types = {
        "#4-40": {
            "Name": "#4-40",
            "diameter": 7.0, // distance from point to point
            "length": 6.3,   // distance from side to side
            "height": 2.4,
            "screw": "#4-40"
        },
        "M6": {
            "Name": "M6",
            "diameter": 11.10, // distance from point to point
            "length": 9.8,   // distance from side to side
            "height": 3.8,
            "screw": "M6"
        }
    };
    this.type = types[type];
    this.diameter = this.type.diameter;
    this.length = this.type.length;
    this.height = this.type.height;

    this.screw;
    if ( args && typeof(args.screw) != 'undefined' )
    {
        if ( typeof(args.screw) == 'object' )
        {
            this.screw = args.screw;
        }
        else
        {
            this.screw = new screw(args.screw);
        }
    }
    else
    {
        this.screw = new screw(this.type.screw);
    }

    this.nut = function()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height],
                    radius: this.diameter / 2
                }).subtract(this.screw.hole())
    }

    this.hole = function(tolerance)
    {
        tolerance = tolerance || tol;
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height + tolerance],
                    radius: ( this.diameter + tolerance ) / 2
                });
    }

    this.slot = function(tolerance)
    {
        tolerance = tolerance || tol;
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height + tolerance],
                    radius: ( this.diameter + tolerance ) / 2,
                    resolution: 6
                });
    }

    this.insertHole = function(insetWidth, insetHeight)
    {
        insetWidth = insetWidth || 2;
        insetHeight = insetHeight || 1;

        return this.hole().translate([0,0,( this.screw.length - insetHeight )])
                .union(CSG.cylinder({
                            start: [0,0,0],
                            end:   [0,0,this.height - insetHeight],
                            radius: ( ( this.diameter ) - insetWidth ) / 2
                        }).translate([0,0,this.screw.length - this.height]))
                .union(this.screw.hole());
    }

    this.insert = function (wallThickness)
    {
        wallThickness = wallThickness || 2;

        return CSG.cylinder({
            start: [0,0,0],
            end:   [0,0,this.screw.length],
            radius: ( this.diameter + wallThickness ) / 2
        })
    }
}
