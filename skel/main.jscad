
include("common.jscad");

var wallThickness = 0.5;
var tol = 0.5;

function getParameterDefinitions()
{
  return [
    { name: 'showReferences', type: 'choice', values: ["yes", "no"], initial: "no", caption: "Show References?" }
  ];
}


function main(params)
{
    var output = [];

    // Axis
    if ( params.showReferences === 'yes' )
    {
        var extents = [componentLength, componentLength, componentHeight + shaftLength];
        output.push(makeAxis(extents));
    }

    return output;
}
