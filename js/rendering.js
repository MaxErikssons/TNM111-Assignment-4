//Create an SVG
function createSvg(width, height) {
  const svg = d3
    .select('.svgContainer')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'inline-block')
    .style('margin-right', '10px')
    .style('border', '1px solid black');
    
   
    return svg;
}

//Add all links to the g element in the SVG
function addLinks(g, links) {
  return g
    .selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style('stroke', '#ededed')
    .style('stroke-width', '1px');
}

//Add all nodes to the g element in the SVG
function addNodes(g, nodes, simulation) {
  return g
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', (d) => d.value / 10)
    .style('fill', (d) => d.colour)
    .call(
      d3
        .drag()
        .on('start', (event, d) => {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) {
            simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
        })
    );
}

//Adds zoom to the SVG-element
function createZoom(g, svg) {
  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  return zoom;
}

function createForceSimulation(nodes, links, width, height) {
  // Create a force simulation to determine the position of the nodes
  var linkForce = d3.forceLink(links).distance(20);
  var bodyForce = d3.forceManyBody().strength(-80);

  var simulation = d3
    .forceSimulation()
    .nodes(nodes)
    .force('charge', bodyForce)
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', linkForce);

  //Store the simulation, link forces and body forces
  simulations.push(simulation);
  linkForces.push(linkForce);
  bodyForces.push(bodyForce);

  return simulation;
}
