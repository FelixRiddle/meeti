const postgressConnection = require("../lib/connection/postgresConnection");
const User = require("./User");

/**
 * Models
 */
class Models {
	constructor() {
		this.conn = postgressConnection();
		
		this.User = User;
	}
	
	async sync() {
		this.conn.sync();
	}
}

module.exports = Models;
