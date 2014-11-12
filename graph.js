/**
 * Created by Kadir on 31.10.2014.
 */

var width = window.innerWidth,
    height = window.innerHeight;

var threshHold = 1;
var limit = -1;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var groups = [];
function calculateEdges(nodes){

    nodes.forEach(function(n){
        n.groups.forEach(function(t){
            if(self.groups[t] == undefined)
                self.groups[t] = [];
            self.groups[t].push(n);
        });
    });

    var edgeMatrix = createMatrix(nodes.length, 0);

    //writing the matrix
    for(var i = 0; i < nodes.length; i++)
    {
        nodes[i].groups.forEach(function(t){
            self.groups[t].forEach(function(article){
                var source = i;
                var target = nodes.indexOf(article);
                edgeMatrix[source][target]++;
            });

        });
    }
    var edges = [];
    //creating edges from matrix
    for(var i = 0 ; i < edgeMatrix.length; i++)
    {
        for(var a = i; a < edgeMatrix.length; a++)
        {
            if(a == i)
                continue;

            if(edgeMatrix[i][a] < threshHold)
                continue;

            var edge =
            {
                "source" : i,
                "target" : a,
                "value" : 1
            }
            edges.push(edge);
        }
    }

    return edges;
}

function createMatrix(size, initialValue)
{
    var matrix = [];
    for(var i=0; i<size; i++) {
        matrix[i] = new Array(size);
    }

    for(var i=0; i < size; i++)
    {
        for(var a=0; a < size; a++)
        {
            matrix[i][a] = 0;
        }
    }
    return matrix;
}

d3.json("daten-berlin_metadata_2.json", function (error, graph) {
    if(limit > 0)
        graph = graph.slice(0,limit);
    var edges = calculateEdges(graph);
    force
        .nodes(graph)
        .links(edges)
        .start();

    var link = svg.selectAll(".link")
        .data(edges)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
            return Math.sqrt(d.value);
        });

    var node = svg.selectAll(".node")
        .data(graph)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", function (d) {
            return color("red");
        })
        .call(force.drag);

    node.append("title")
        .text(function (d) {
            return d.name;
        });

    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });
    });
});