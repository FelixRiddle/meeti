const { OpenStreetMapProvider } = require("leaflet-geosearch");


document.addEventListener("DOMContentLoaded", (event) => {
	const latitudeEl = document.getElementById("latitude");
	const longitudeEl = document.getElementById("longitude");
	
	if(!latitudeEl || !longitudeEl) {
		throw Error("A coordinate element wasn't found");
	}
	const latitude = latitudeEl.value;
	const longitude = latitudeEl.value;
	
	// Map
	const coordinates = [latitude, longitude];
	const map = L.map('map').setView(coordinates, 13);
	
	// Search provider
	const provider = new OpenStreetMapProvider();
	
	// Marker
	const markerLocation = L.marker(coordinates, {
		draggable: true,
		autoPan: true,
	}).addTo(map)
		.bindPopup('Meeti location')
		.openPopup();
	
	// Create tile layer
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
});
