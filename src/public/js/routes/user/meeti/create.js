import SelectLocationMap from "../../../lib/map/SelectLocationMap";

const selectLocation = new SelectLocationMap();

// Wait until the website loads
document.addEventListener("DOMContentLoaded", () => {
	// Place
	const street = document.getElementById('street');
	const city = document.getElementById("city");
	const state = document.getElementById("state");
	const country = document.getElementById("country");
	
	// Coordinates
	const latitudeElement = document.getElementById("latitude");
	const longitudeElement = document.getElementById("longitude");
	
	const allExist = street && city && state && country && latitude && longitude;
	if(!allExist) {
		throw Error("A element doesn't exists");
	}
	
	selectLocation.setUpdateCallback(({
		address,
		latitude,
		longitude
	}) => {
		// Fill inputs
		street.value = address.road;
		city.value = address.city;
		state.value = address.state;
		country.value = address.country;
		
		latitudeElement.value = latitude;
		longitudeElement.value = longitude;
	});
});
