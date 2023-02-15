let data;
let simulations = [];
let linkForces = [];
let bodyForces = [];
let allNodes = [];

//Clear all elements.
function removeElements() {
  d3.selectAll('svg').remove();
  allNodes = [];
  simulations.forEach((simulation, index) => {
    simulation.stop();
    simulation.nodes([]);
    simulation.force('link', null);
    simulation.force('charge', null);
    simulation.force('center', null);
    simulation.alphaTarget(0);
    simulation.alphaDecay(0);
    simulation.velocityDecay(0);
    linkForces[index] = null;
    bodyForces[index] = null;
  });
  linkForces = [];
  bodyForces = [];
  simulations = [];
}

function fetchData() {
  // Get all the checkbox elements with class "episode"
  const checkboxes = document.querySelectorAll('.episode');

  // Set default episode to null
  let selectedEpisodes = [];

  // Function to fetch and render data for a given episode
  const fetchAndRenderData = (url) => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        data = json;
        render();
      });
  };

  // Loop through each checkbox
  checkboxes.forEach((checkbox) =>
    // Add change event listener to each checkbox
    checkbox.addEventListener('change', (e) => {
      // If a checkbox is checked, set episode to the value of the checkbox
      if (e.target.checked) selectedEpisodes.push(e.target.value);
      // If the checkbox is unchecked, set episode to null
      else
        selectedEpisodes = selectedEpisodes.filter(
          (ep) => ep !== e.target.value
        );

      // Fetch and render data for all selected episodes
      if (selectedEpisodes.length > 0) {
        removeElements();
        selectedEpisodes.forEach((ep) => {
          fetchAndRenderData(
            `db/starwars-episode-${ep}-interactions-allCharacters.json`
          );
        });
      } else {
        // If no episode is selected, fetch data for full interactions
        removeElements();
        fetchAndRenderData('db/starwars-full-interactions-allCharacters.json');
      }
    })
  );

  // When starting the program we get here, fetch data for full interactions
  if (selectedEpisodes.length === 0) {
    removeElements();
    fetchAndRenderData('db/starwars-full-interactions-allCharacters.json');
  }
}

function render() {
  // Get the nodes and links from the data
  const nodes = data.nodes;
  const links = data.links;

  // Set the dimensions of the diagram
  const width = 600;
  const height = 600;

  // Create a svg element to hold the diagram
  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'inline-block')
    .style('margin-right', '10px');

  // Add the links to the svg element
  const link = svg
    .selectAll('.link')
    .data(links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .style('stroke', '#ededed')
    .style('stroke-width', '1px');

  // Add the nodes to the svg element
  const node = svg
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

  //Store the nodes
  allNodes.push(nodes);

  //Used for highlighting linking nodes
  linkingNodes = [];

  //on hover event
  node.on('mouseover', (event, d) => {
    const infoBox = d3.select('#infoBox'); // Select the HTML element for the information box
    infoBox
      .html(`<p>Name: ${d.name}</p><p>Value: ${d.value}</p>`) // Update the contents with the name and value of d
      .style('visibility', 'visible'); // Make the information box visible

    //Store nodes with the same name in different SVG:s.
    linkingNodes = allNodes.flatMap((nodes) =>
      nodes.filter((node) => node.name === d.name)
    );

    // Highlight the linking nodes by adjusting the size of the nodes.
    d3.selectAll('circle')
      .filter((node) => node.name === d.name)
      .attr('r', (node) => (node.value + 15) / 10);
  });

  //off hover event
  node.on('mouseout', (event, d) => {
    d3.select('#infoBox').style('visibility', 'hidden'); // Hide the information box
    d3.select(event.target).attr('r', (d) => d.value / 10);

    //Restore the size of all nodes and empty the linkingNodes array.
    d3.selectAll('circle')
      .filter((node) => node.name === d.name)
      .attr('r', (node) => node.value / 10);
    linkingNodes = [];
  });

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

  // Start the simulation
  simulation.nodes(nodes).on('tick', ticked);
  simulation.force('link').links(links);

  //Slider to adjust the link distance
  d3.select('#linkSlider').on('input', function () {
    var distance = +this.value; // get the slider value as a number
    linkForces.forEach(function (linkForce) {
      linkForce.distance(distance); // update the link distance
    });

    simulations.forEach(function (simulation) {
      simulation.alpha(1).restart(); // restart the simulation
    });
  });

  //Slider to adjust the force strength
  d3.select('#forceSlider').on('input', function () {
    var force = +this.value; // get the slider value as a number
    bodyForces.forEach(function (bodyForce) {
      bodyForce.strength(force); // update the link distance
    });

    simulations.forEach(function (simulation) {
      simulation.alpha(1).restart(); // restart the simulation
    });
  });

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

fetchData();
