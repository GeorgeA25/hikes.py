// Initialise the map and set its view to a specific location with a zoom level of 2
const map = L.map('map').setView([51.505, -0.09], 2);

// Add OpenStreetMap tiles to the map and set the attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to handle map clicks
async function onMapClick(e) {
    // Prompt the user to enter a description for the hike
    const description = prompt("Enter a description for this hike:");

    // If the user provides a description
    if (description) {
        // Create a data object containing the latitude, longitude, and description
        const data = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            description: description
        };

        try {
            // Send a POST request to the server to add the hike
            const response = await fetch('/add_hike', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Process the server response
            const responseData = await response.json();

            // Alert the user with the message from the server
            alert(responseData.message);

            // Reload the hikes on the map
            await loadHikes();
        } catch (error) {
            console.error('Error adding hike:', error);
        }
    }
}

// Attach the onMapClick function to the map click event
map.on('click', onMapClick);

// Function to load all hikes from the server
async function loadHikes() {
    try {
        // Send a GET request to the server to fetch all hikes
        const response = await fetch('/get_hikes');

        // Process the server response
        const hikes = await response.json();

        // Clear existing markers on the map before adding new ones
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Iterate through the hikes and add markers to the map for each hike
        hikes.forEach(hike => {
            L.marker([hike.latitude, hike.longitude]).addTo(map)
            .bindPopup(hike.description);
        });
    } catch (error) {
        console.error('Error loading hikes:', error);
    }
}

// Load hikes when the page loads
loadHikes();

// Function to load all hikes from the server
async function loadHikes() {
    try {
        // Send a GET request to the server to fetch all hikes
        const response = await fetch('/get_hikes');

        // Process the server response
        const hikes = await response.json();

        // Clear existing markers on the map before adding new ones
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Iterate through the hikes and add markers to the map for each hike
        hikes.forEach(hike => {
            L.marker([hike.latitude, hike.longitude]).addTo(map)
            .bindPopup(`<b>${hike.description}</b><br>Rating: ${hike.rating} Stars<br>Difficulty: ${hike.difficulty}`);
        });
    } catch (error) {
        console.error('Error loading hikes:', error);
    }
}

// Function to handle form submission for filtering hikes
document.getElementById('filter-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the selected rating and difficulty from the form
    const rating = document.getElementById('rating').value;
    const difficulty = document.getElementById('difficulty').value;

    // Log the selected values
    console.log("Selected Rating", rating);
    console.log("Selected Difficulty", difficulty);



    // Send a request to the server to fetch filtered hikes
    fetch(`/get_hikes?rating=${rating}&difficulty=${difficulty}`)
        .then(response => response.json())
        .then(data => {
            // Clear existing markers on the map
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Add filtered hikes to the map
            data.forEach(hike => {
                L.marker([hike.latitude, hike.longitude]).addTo(map)
                .bindPopup(`<b>${hike.description}</b><br>Rating: ${hike.rating} Stars<br>Difficulty: ${hike.difficulty}`);
            });
        })
        .catch(error => console.error('Error fetching filtered hikes:', error));
});

// Register service worker when the document is ready
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  
  // Unregister existing Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
  }
  