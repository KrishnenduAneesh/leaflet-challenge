// Function to create the map
function createMap(earthquakeData) {
    // Create a Leaflet map centered at [0, 0]
    const map = L.map('map').setView([0, 0], 2);
  
    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    // Define a function to determine the color based on depth
    function getColor(depth) {
      return depth > 90 ? 'darkred' :
             depth > 70 ? 'red' :
             depth > 50 ? 'orange' :
             depth > 30 ? 'yellow' :
                         'lightgreen';
    }
  
    // Loop through the earthquake data and add markers to the map
    earthquakeData.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
  
      // Create a circle marker at the coordinates with size and color based on magnitude and depth
      const circle = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: magnitude * 5,
        color: 'black',
        fillColor: getColor(depth),
        fillOpacity: 0.8
      }).addTo(map);
  
      // Add a popup with additional information
      circle.bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}`);
    });
  
    // Create a legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'legend');
      const depths = [0, 10, 30, 50, 70, 90];
      div.innerHTML = '<b>Depth Legend</b><br>';
      for (let i = 0; i < depths.length; i++) {
        div.innerHTML += `<i style="background:${getColor(depths[i] + 1)}"></i>${depths[i]}-${depths[i + 1]} km<br>`;
      }
      return div;
    };
    legend.addTo(map);
  }
  
  // Fetch earthquake data from the provided URL
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => createMap(data))
    .catch(error => console.error('Error fetching earthquake data:', error));