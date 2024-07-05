import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

const londonCoordinates = [51.505, -0.09];
const map = L.map('map').setView(londonCoordinates, 13);

// let markers = new L.FeatureGroup().addTo(map);
let marker = L.marker(londonCoordinates, {
	draggable: true,
	autoPan: true,
}).addTo(map)
	.bindPopup('Meeti location')
	.openPopup();

/**
 * Locate
 */
function locate(e) {
	if(e.target.value.length > 8) {
		const provider = new OpenStreetMapProvider();
		
		if(marker) {
			map.remove(marker);
		}
		
		// markers.clearLayers();
		
		// provider.search({
		// 	query: e.target.value
		// }).then((res) => {
		// 	const first = res[0];
		// 	const location = first.bounds[0];
		// 	map.setView(location);
			
		// 	marker = new L.marker(location, {
		// 		draggable: true,
		// 		autoPan: true,
		// 	}).addTo(map)
		// 		.bindPopup(first.label)
		// 		.openPopup();
			
		// 	markers.addLayer(marker);
			
		// 	marker.on("moveend", function(e) {
		// 		const marker = e.target;
		// 		const position = marker.getLatLng();
		// 		map.panTo(new L.LatLng(
		// 			position.lat,
		// 			position.lng
		// 		));
				
		// 		// TODO: Reverse geocoding
		// 	});
		// });
	}
}

document.addEventListener("DOMContentLoaded", () => {
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	const search = new GeoSearchControl({
		provider: new OpenStreetMapProvider(),
		style: "bar"
	});
	
	map.addControl(search);
});
