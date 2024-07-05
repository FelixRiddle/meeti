import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

// Map
const londonCoordinates = [51.505, -0.09];
const map = L.map('map').setView(londonCoordinates, 13);

// Search provider
const provider = new OpenStreetMapProvider();

// Marker
let markerLocation = L.marker(londonCoordinates, {
	draggable: true,
	autoPan: true,
}).addTo(map)
	.bindPopup('Meeti location')
	.openPopup();

// Wait until the website loads
document.addEventListener("DOMContentLoaded", () => {
	// Create tile layer
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	// Insert search bar
	const search = new GeoSearchControl({
		notFound: "The address you were looking for couldn't be found",
		provider,
		style: "bar",
		showMarker: false,
	});
	map.addControl(search);
	
	// Go to location
	map.on("geosearch/showlocation", (e) => {
		const place = e.location;
		console.log(`Place: `, place);
		const location = [place.y, place.x];
		console.log(`Location: `, location);
		
		// Update marker
		const placeName = place.label;
		markerLocation.setLatLng(location)
			.bindPopup(placeName)
			.openPopup();
	});
});
