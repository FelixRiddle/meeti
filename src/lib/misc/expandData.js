const color = require('ansi-color');

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
		user = JSON.parse(JSON.stringify(req.user));
	}
	
	// Messages
	let messages = [];
	const flashMessages = req.flash().messages;
	if(flashMessages) {
		for(const message of messages) {
			if(message.type === "error" || message.error) {
				console.log(color.set(message, "red"));	
			} else {
				console.log(color.set(message, "green"));	
			}
		}
		
		messages = messages.concat(flashMessages);
	}
	
	return {
		user,
		messages
	};
}

module.exports = expandData;
