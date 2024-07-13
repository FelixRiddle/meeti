const postgressConnection = require("../lib/connection/postgresConnection");
const createAddressModel = require("./Address");
const createGroupsModel = require("./Groups");
const createMeetiParticipantsModel = require("./MeetiParticipants");
const createMeetiModel = require("./Meeti");
const createSocialCategoryModel = require("./SocialCategory");
const createUserModel = require("./User");
const createCommentModel = require("./Comment");

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
		
		// Meeti participants
		this.MeetiParticipants = createMeetiParticipantsModel(this.conn, this.Meeti, this.User);
		this.Comment = createCommentModel(this.conn, this.User, this.Meeti);
	}
	
	/**
	 * Create all tables
	 */
	async sync() {
		await this.conn.sync();
		
		for(const model of this.models()) {
			await model.sync();
		}
	}
	
	/**
	 * Drop all tables
	 */
	async dropAll() {
		for(const model of this.models().reverse()) {
			try {
				await model.drop();
			} catch(err) {
				
			}
		}
	}
	
	/**
	 * Get models from least dependent to most
	 */
	models() {
		return [
			this.User,
			this.SocialCategory,
			this.Address,
			
			this.Groups,
			this.Meeti,
			this.MeetiParticipants,
			this.Comment,
		];
	}
}

module.exports = Models;
