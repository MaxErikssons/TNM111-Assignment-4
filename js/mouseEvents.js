//Hover event on
function handleNodeMouseOver(event, d) {
  const infoBox = d3.select('#infoBox');
  infoBox
    .html(`<p>Name: ${d.name}</p><p>Value: ${d.value}</p>`)
    .style('visibility', 'visible');

  linkingNodes = allNodes.flatMap((nodes) =>
    nodes.filter((node) => node.name === d.name)
  );

  d3.selectAll('circle')
    .filter((node) => node.name === d.name)
    .attr('r', (node) => (node.value + 15) / 10);
}

//Hover event off
function handleNodeMouseOut(event, d) {
  d3.select('#infoBox').style('visibility', 'hidden');
  d3.select(event.target).attr('r', (d) => d.value / 10);

  d3.selectAll('circle')
    .filter((node) => node.name === d.name)
    .attr('r', (node) => node.value / 10);

  linkingNodes = [];
}
