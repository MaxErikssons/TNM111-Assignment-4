//Adds a slider for the link distance
function addLinkSlider() {
  d3.select('#linkSlider').on('input', function () {
    var distance = +this.value; // get the slider value as a number
    linkForces.forEach(function (linkForce) {
      linkForce.distance(distance); // update the link distance
    });

    simulations.forEach(function (simulation) {
      simulation.alpha(1).restart(); // restart the simulation
    });
  });
}

//Adds a slider for the strength force.
function addForceSlider() {
  d3.select('#forceSlider').on('input', function () {
    var force = +this.value; // get the slider value as a number
    bodyForces.forEach(function (bodyForce) {
      bodyForce.strength(force); // update the link distance
    });

    simulations.forEach(function (simulation) {
      simulation.alpha(1).restart(); // restart the simulation
    });
  });
}
