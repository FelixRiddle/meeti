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
	
	// Go to location through the search
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
	
	// Update marker info
	markerLocation.on("dragend", async (e) => {
		console.log(`Event: `, e);
		const place = e.target;
		const latLng = place._latlng;
		const location = [latLng.lat, latLng.lng];
		
		console.log(`Location: `, location);
		
		const lat = latLng.lat;
		const lng = latLng.lng;
		// Down to building information
		const zoom = 18;
		let extraParams = "";
		
		// Webpack environment plugin is not working
		// // Append email if given
		// const email = process.env.SERVICE_EMAIL;
		// if(email) {
		// 	extraParams += `&email=${email}`;
		// }
		
		// We've got to reverse geocode the location
		// Nominatim is free and does exactly that
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=${zoom}${extraParams}`
		);
		
		if(response.ok) {
			const place = await response.json();
			
			// Update marker
			const placeName = place.display_name;
			markerLocation.setLatLng(location)
				.bindPopup(placeName)
				.openPopup();
			
			// Place address
			const address = place.address;
			console.log(`Place address: `, address);
		}
	});
});
