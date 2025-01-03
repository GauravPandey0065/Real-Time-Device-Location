const socket = io(); // Initialize Socket.IO client

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude }); // Emit location data to the server
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Initialize the map
const map = L.map("map").setView([0, 0],10); // Set initial map position

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "OpenStreetMap"
}).addTo(map);

// Store markers by socket ID
const markers = {};

// Listen for "recieve-location" events
socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]); // Center the map on the received location
    
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update marker position
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker
    }
});

// Listen for "user-disconnected" events
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Remove marker if user disconnects
        delete markers[id];
    }
});
