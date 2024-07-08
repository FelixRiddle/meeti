import SelectLocationMap from "../../../lib/map/SelectLocationMap";

const selectLocation = new SelectLocationMap();

// Wait until the website loads
document.addEventListener("DOMContentLoaded", async () => {
	// Place
	const street = document.getElementById('street');
	const city = document.getElementById("city");
	const state = document.getElementById("state");
	const country = document.getElementById("country");
	
	// Coordinates
	const latitudeElement = document.getElementById("latitude");
	const longitudeElement = document.getElementById("longitude");
	
	const allExist = street && city && state && country && latitudeElement && longitudeElement;
	if(!allExist) {
		throw Error("A element doesn't exists");
	}
	
	const previousLatitude = latitudeElement.value;
	const previousLongitude = longitudeElement.value;
	await selectLocation.setMarkerPosition(Number(previousLatitude), Number(previousLongitude));
	
	selectLocation.setUpdateCallback(({
		address,
		latitude,
		longitude
	}) => {
		// Fill inputs
		street.value = address.road || address.street;
		city.value = address.city;
		state.value = address.state;
		country.value = address.country;
		
		// Coordinates
		latitudeElement.value = latitude;
		longitudeElement.value = longitude;
	});
});
