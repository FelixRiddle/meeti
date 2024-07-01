const postgressConnection = require("../lib/connection/postgresConnection");
const createUserModel = require("./User");

/**
 * Models
 */
class Models {
	constructor() {
		this.conn = postgressConnection();
		
		this.User = createUserModel(this.conn);
	}
	
	async sync() {
		this.conn.sync();
	}
}

module.exports = Models;
