screw = function(argType, argLength)
{
    var types = {
        "1/4": {
            "Name": "1/4\"",
            "diameter": 3.0,
            "defaultLength": 6.0
        }
    };
    this.type = types[argType];
    this.length = argLength || this.type["defaultLength"];
    this.diameter = this.type.diameter;

    this.screw = function ()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.length],
                    radius: this.diameter / 2
                });
    }

    this.hole = function ()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.length],
                    radius: ( this.diameter + tol ) / 2
                });
    }
}

nut = function(argType, argScrew)
{
    var types = {
        "1/4": {
            "Name": "1/4",
            "diameter": 7.0,
            "height": 2.3,
            "screw": "1/4"
        }
    };
    this.type = types[argType];
    this.diameter = this.type.diameter;
    this.height = this.type.height;

    this.screw;
    if ( typeof(argScrew) != 'undefined' )
    {
        if ( typeof(argScrew) == 'object' )
        {
            this.screw = argScrew;
        }
        else
        {
            this.screw = new screw(argScrew);
        }
    }
    else
    {
        this.screw = new screw(type["screw"]);
    }

    this.nut = function()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height],
                    radius: this.diameter / 2
                }).subtract(this.screw.hole())
    }

    this.hole = function()
    {
        return CSG.cylinder({
                    start: [0,0,0],
                    end:   [0,0,this.height],
                    radius: ( this.diameter + tol ) / 2
                });
    }

    this.insertHole = function(argInsetWidth, argInsetHeight)
    {
        var insetWidth = argInsetWidth || 2;
        var insetHeight = argInsetHeight || 1;

        return this.hole().translate([0,0,( this.screw.length - insetHeight )])
                .union(CSG.cylinder({
                            start: [0,0,0],
                            end:   [0,0,this.height - insetHeight],
                            radius: ( ( this.diameter + tol ) - insetWidth ) / 2
                        }).translate([0,0,this.screw.length - this.height]))
                .union(this.screw.hole());
    }

    this.insert = function (argWallThickness)
    {
        var wallThickness = argWallThickness || 2;

        return CSG.cylinder({
            start: [0,0,0],
            end:   [0,0,this.screw.length],
            radius: ( this.diameter + wallThickness ) / 2
        })
    }
}
