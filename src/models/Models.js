const postgressConnection = require("../lib/connection/postgresConnection");
const createSocialCategoryModel = require("./SocialCategory");
const createUserModel = require("./User");

/**
 * Models
 */
class Models {
	constructor() {
		this.conn = postgressConnection();
		
		this.User = createUserModel(this.conn);
		this.SocialCategory = createSocialCategoryModel(this.conn);
	}
	
	async sync() {
		await this.conn.sync();
		await this.User.sync();
		await this.SocialCategory.sync();
	}
}

module.exports = Models;
