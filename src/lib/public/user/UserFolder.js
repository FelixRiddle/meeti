const fs = require('fs');
const path = require("path");

/**
 * User folder
 */
module.exports = class UserFolder {
	constructor(user) {
		this.user = user;
	}
	
	/**
	 * Get user folder path
	 */
	get() {
		return path.join(process.cwd(), 'public', 'user', this.user.id);
	}
	
	/**
	 * Create folder
	 */
	createFolder() {
		// User folder
		const userFolder = this.get();
		if (!fs.existsSync(userFolder)) {
			fs.mkdirSync(userFolder);
		}
	}
	
	/**
	 * Get pfp path
	 */
	getPfp() {
		return path.join(this.get(), this.user.pfp);
	}
}
