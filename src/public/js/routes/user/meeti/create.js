import SelectLocationMap from "../../../lib/map/SelectLocationMap";

const selectLocation = new SelectLocationMap();

selectLocation.setUpdateCallback(({
	address,
}) => {
	// Fill inputs
	console.log(`Address: `, address);
});
