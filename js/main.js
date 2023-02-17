let data;
let simulations = [];
let linkForces = [];
let bodyForces = [];
let allNodes = [];

function render(episode) {
  // Get the nodes and links from the data
  const nodes = data.nodes;
  const links = data.links;

  //Store the nodes
  allNodes.push(nodes);

  // Set the dimensions of the diagram
  const width = 600;
  const height = 600;

  // Create a svg element to hold the diagram
  const svg = createSvg(width, height);

  // Add title to the svg element
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('text-decoration', 'underline')
    .text('Episode:' + episode);
  const g = svg.append('g');

  // Add the links to the g element
  const link = addLinks(g, links);

  // Create a zoom behaviour
  createZoom(g, svg);

  // Create a force simulation
  var simulation = createForceSimulation(nodes, links, width, height);

  // Add the nodes to the g element
  const node = addNodes(g, nodes, simulation);

  //Mouse node event
  node.on('mouseover', handleNodeMouseOver);
  node.on('mouseout', handleNodeMouseOut);

  link.on('mouseover', (event, d) => handleLinkMouseOver(event, d, g));
  link.on('mouseout', (event, d) => handleLinkMouseOut(event, d, g));

  // Start the simulation
  simulation.nodes(nodes).on('tick', ticked);
  simulation.force('link').links(links);

  //Add sliders to adjust the link distance and force strength
  addLinkSlider();
  addForceSlider();

  function ticked() {
    link
      .attr('x1', function (d) {
        return d.source.x;
      })
      .attr('y1', function (d) {
        return d.source.y;
      })
      .attr('x2', function (d) {
        return d.target.x;
      })
      .attr('y2', function (d) {
        return d.target.y;
      });

    node
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  }
}
