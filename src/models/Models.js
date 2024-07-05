const postgressConnection = require("../lib/connection/postgresConnection");
const createAddressModel = require("./Address");
const createGroupsModel = require("./Groups");
const createMeetiModel = require("./Meeti");
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
		this.Address = createAddressModel(this.conn);
		
		this.Groups = createGroupsModel(this.conn, this.SocialCategory, this.User);
		
		this.Meeti = createMeetiModel(this.conn, this.User, this.Groups, this.Address);
	}
	
	async sync() {
		await this.conn.sync();
		
		await this.User.sync();
		await this.SocialCategory.sync();
		await this.Address.sync();
		
		await this.Groups.sync();
		
		await this.Meeti.sync();
	}
}

module.exports = Models;
