import { OpenStreetMapProvider } from "leaflet-geosearch";

const londonCoordinates = [51.505, -0.09];
const map = L.map('map').setView(londonCoordinates, 13);

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
	if(e.target.value.length > 3) {
		const provider = new OpenStreetMapProvider();
		
		provider.search({
			query: e.target.value
		}).then((res) => {
			const first = res[0];
			const location = first.bounds[0];
			map.setView(location);
			
			marker = new L.marker(location, {
				draggable: true,
				autoPan: true,
			}).addTo(map)
				.bindPopup(first.label)
				.openPopup();
		});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	const browser = documnent.querySelector("#browser");
	browser.addEventListener("input", locate);
});
