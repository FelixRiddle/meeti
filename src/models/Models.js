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
		// This doesn't updates tables, you've got to delete them
		// It's only for creating tables
		await this.conn.sync();
	}
}

module.exports = Models;
