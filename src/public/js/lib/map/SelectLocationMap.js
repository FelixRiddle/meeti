import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";


/**
 * Select location map
 */
export default class SelectLocationMap {
	updateCallback = undefined;
	markerLocation = undefined;
	
	// Current information
	address = undefined;
	
	/**
	 * 
	 */
	constructor(options = {}) {
		// London coordinates
		this.lat = options.lat || 51.505;
		this.lng = options.lng || -0.09;
		
		// Map
		const londonCoordinates = [this.lat, this.lng];
		const map = L.map('map').setView(londonCoordinates, 13);
		
		// Search provider
		const provider = new OpenStreetMapProvider();
		
		// Marker
		this.markerLocation = L.marker(londonCoordinates, {
			draggable: true,
			autoPan: true,
		}).addTo(map)
			.bindPopup('Meeti location')
			.openPopup();
		
		const self = this;
		
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
				const lat = place.y;
				const lng = place.x;
				
				self.updateMarker(lat, lng);
			});
			
			// Update marker info
			self.markerLocation.on("dragend", async (e) => {
				const place = e.target;
				const latLng = place._latlng;
				
				const lat = latLng.lat;
				const lng = latLng.lng;
				
				await self.updateMarker(self, lat, lng);
			});
		});
	}
	
	/**
	 * Set marker position
	 * 
	 * Alias for update marker which does the same thing
	 */
	async setMarkerPosition(lat, lng) {
		return await this.updateMarker(this, lat, lng);
	}
	
	/**
	 * Update marker
	 */
	async updateMarker(selectLocation, lat, lng) {
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
			const location = [lat, lng];
			const placeName = place.display_name;
			
			selectLocation.lat = lat;
			selectLocation.lng = lng;
			
			selectLocation.markerLocation.setLatLng(location)
				.bindPopup(placeName)
				.openPopup();
			
			// Place address
			const address = place.address;
			selectLocation.address = address;
			
			if(selectLocation.updateCallback) {
				selectLocation.updateCallback();
			}
		}
	}
	
	/**
	 * Callback called on marker update
	 */
	setUpdateCallback(cb) {
		this.updateCallback = () => cb({
			address: this.address,
			latitude: this.lat,
			longitude: this.lng
		});
	}
}
