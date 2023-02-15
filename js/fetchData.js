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

fetchData();
