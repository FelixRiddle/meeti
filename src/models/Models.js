const postgressConnection = require("../lib/connection/postgresConnection");
const createGroupsModel = require("./Groups");
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
		
		this.Groups = createGroupsModel(this.conn, this.SocialCategory, this.User);
	}
	
	async sync() {
		await this.conn.sync();
		await this.User.sync();
		await this.SocialCategory.sync();
		
		await this.Groups.sync();
	}
}

module.exports = Models;
