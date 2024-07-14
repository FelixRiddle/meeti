const axios = require('axios');
const { OpenStreetMapProvider } = require("leaflet-geosearch");
const Swal = require("sweetalert2");

/**
 * Create map
 */
function createMap() {
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
	
	// Participate button
	const participateButton = document.getElementById("participateButton");
	const participateInput = document.getElementById('participate');
	const formElement = document.getElementById("participateForm");
	if(participateButton && participateInput && formElement) {
		participateButton.addEventListener("click", async (e) => {
			e.preventDefault();
			
			const response = await axios.post(formElement.action, formElement, {
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then((res) => {
					if(participateInput.value === 'yes') {
						participateInput.value = "no";
						participateButton.value = "Participate";
						participateButton.classList.remove("btn-rojo");
						participateButton.classList.add("btn-azul");
					} else {
						participateInput.value = "yes";
						participateButton.value = "Cancel";
						participateButton.classList.remove("btn-azul");
						participateButton.classList.add("btn-rojo");
					}
				});
		});
	} else {
		throw Error("An element wasn't found!");
	}
}

/**
 * Delete comments
 */
function deleteCommentsBehavior() {
	const deleteCommentForms = document.querySelectorAll(".eliminar-comentario");
	
	if(deleteCommentForms.length === 0) {
		return;
	}
	
	deleteCommentForms.forEach((form) => {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			
			const data = new FormData(form);
			const dataResponse = await axios.post(
				form.action,
				data,
				{
					headers: {
						"Content-Type": "application/json"
					}
				}).then((res) => {
					
				});
		});
	});
}

document.addEventListener("DOMContentLoaded", (event) => {
	createMap();
	
	deleteCommentsBehavior();
});
