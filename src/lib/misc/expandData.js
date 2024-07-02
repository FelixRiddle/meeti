/**
 * Expand data
 */
function expandData(req) {
	if(!req) {
		throw Error("You must pass 'req' for expand data to work");
	}
	
	// User
	let user = undefined;
	if(req.user) {
		console.log(`Request user: `, req.user);
		user = JSON.parse(JSON.stringify(req.user));
	}
	
	// Messages
	let messages = [];
	const flashMessages = req.flash().messages;
	if(flashMessages) {
		messages = messages.concat(flashMessages);
	}
	
	return {
		user,
		messages
	};
}

module.exports = expandData;
