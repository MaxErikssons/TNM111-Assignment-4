let data;
let simulations = [];
let linkForces = [];
let forceBodies = [];

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
        console.log(selectedEpisodes);
        d3.selectAll('svg').remove();
        selectedEpisodes.forEach((ep) => {
          fetchAndRenderData(
            `db/starwars-episode-${ep}-interactions-allCharacters.json`
          );
        });
      } else {
        // If no episode is selected, fetch data for full interactions
        d3.selectAll('svg').remove();
        fetchAndRenderData('db/starwars-full-interactions-allCharacters.json');
      }
    })
  );

  // When staring the program we get here, fetch data for full interactions
  if (selectedEpisodes.length === 0) {
    d3.selectAll('svg').remove();
    fetchAndRenderData('db/starwars-full-interactions-allCharacters.json');
  }
}

function render() {
  console.log(data);

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

  //The labeling is problematic...
  const label = svg
    .selectAll('.label')
    .data(nodes)
    .enter()
    .append('text')
    .attr('class', 'label')
    .text((d) => d.name)
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .style('font-size', '10px');

  // Create a force simulation to determine the position of the nodes
  var linkForce = d3.forceLink(links).distance(20);
  var forceBody = d3.forceManyBody().strength(-80);

  var simulation = d3
    .forceSimulation()
    .nodes(nodes)
    .force('charge', forceBody)
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('link', linkForce);

  simulations.push(simulation);
  console.log(simulations);
  linkForces.push(linkForce);
  forceBodies.push(forceBody);

  // Start the simulation
  simulation.nodes(nodes).on('tick', ticked);
  simulation.force('link').links(links);

  d3.select('#linkSlider').on('input', function () {
    var distance = +this.value; // get the slider value as a number
    linkForces.forEach(function (linkForce) {
      linkForce.distance(distance); // update the link distance
    });

    simulations.forEach(function (simulation) {
      console.log(simulations);
      simulation.alpha(1).restart(); // restart the simulation
    });
  });

  d3.select('#forceSlider').on('input', function () {
    var force = +this.value; // get the slider value as a number
    forceBodies.forEach(function (forceBody) {
      forceBody.strength(force); // update the link distance
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
