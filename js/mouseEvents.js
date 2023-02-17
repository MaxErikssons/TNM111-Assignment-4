//Hover event on
function handleNodeMouseOver(event, d) {
  const infoBox = d3.select('#infoBox');

  const name = `<p>Name: ${d.name}</p>`;
  infoBox
    .html(`${name}<p>Interactions: ${d.value}</p>`)
    .style('visibility', 'visible');

  linkingNodes = allNodes.flatMap((nodes) =>
    nodes.filter((node) => node.name === d.name)
  );

  d3.selectAll('circle')
    .filter((node) => node.name === d.name)
    .attr('r', (node) => (node.value + 15) / 10);

  d3.selectAll('line')
    .filter((link) => d.name === link.source.name)
    .style('stroke', 'orange');
  /*d3.selectAll('line')
    .filter((link) => d.name === link.target)
    .style('stroke', 'orange');*/

  infoBoxStyle(event, infoBox);
}

//Hover event off
function handleNodeMouseOut(event, d) {
  d3.select('#infoBox').style('visibility', 'hidden');
  d3.select(event.target).attr('r', (d) => d.value / 10);

  d3.selectAll('circle')
    .filter((node) => node.name === d.name)
    .attr('r', (node) => node.value / 10);

  d3.selectAll('line').style('stroke', '#ededed');

  linkingNodes = [];
}

//Hover event on
function handleLinkMouseOver(event, d, g) {
  const infoBox = d3.select('#infoBox');

  const name = `<p>Characters: ${d.source.name} & ${d.target.name}</p>`;
  infoBox
    .html(`${name}<p>Interactions: ${d.value}</p>`)
    .style('visibility', 'visible');

  linkingNodes = allNodes.flatMap((nodes) =>
    nodes.filter((node) => node.name === d.name)
  );

  g.selectAll('.link')
    .filter((link) => link.index === d.index)
    .style('stroke', 'orange');

  infoBoxStyle(event, infoBox);
}

//Hover event off
function handleLinkMouseOut(event, d) {
  d3.select('#infoBox').style('visibility', 'hidden');

  d3.selectAll('line')
    .filter((link) => link.index === d.index)
    .style('stroke', '#ededed');
}

function infoBoxStyle(event, infoBox) {
  const offsetX = 10; // Set this to the desired offset from the mouse pointer
  const offsetY = 10; // Set this to the desired offset from the mouse pointer
  const infoBoxWidth = infoBox.node().getBoundingClientRect().width;
  const infoBoxHeight = infoBox.node().getBoundingClientRect().height;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let leftPos = event.pageX + offsetX;
  if (leftPos + infoBoxWidth > windowWidth) {
    leftPos = windowWidth - infoBoxWidth;
  }

  let topPos = event.pageY + offsetY;
  if (topPos + infoBoxHeight > windowHeight) {
    topPos = windowHeight - infoBoxHeight;
  }

  return infoBox.style('left', leftPos + 'px').style('top', topPos + 'px');
}
