const { Op } = require("sequelize");
const moment = require("moment");

/**
 * Meeti utils
 * 
 * Helper class for meeti model
 */
module.exports = class MeetiUtils {
	// Logged in user data
	user = undefined;
	// User model
	User = undefined;
	
	constructor(Models, user) {
		this.user = user;
		
		const {
			Address,
			Groups,
			Meeti,
			MeetiParticipants,
			User,
		} = Models;
		this.Address = Address;
		this.Groups = Groups;
		this.Meeti = Meeti;
		this.MeetiParticipants = MeetiParticipants;
		this.User = User;
	}
	
	/**
	 * Check if the user participates
	 */
	userParticipates(meetiModel) {
		if(!this.user) {
			return false;
		}
		
		for(const participant of meetiModel.participants) {
			if(this.user.id === participant.id) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Obtain meeti participants
	 * 
	 * Removes model abstraction of sequelize
	 */
	async obtainMeetiParticipants(meetiModel) {
		const meeti = JSON.parse(JSON.stringify(meetiModel));
		const participantsIdData = await this.MeetiParticipants.findAll({
			where: {
				meetiId: meeti.id,
			},
			raw: true,
		});
		
		const participantIds = participantsIdData.map((participant) => Number(participant.userId));
		
		const User = this.User;
		const participantsResult = await Promise.all(participantIds.map((id) => {
			return User.findByPk(id, {
				raw: true,
			});
		}));
		
		meeti.participants = participantsResult;
		
		return meeti;
	}
	
	/**
	 * Get meeti with owner user, group, participants and address
	 */
	async completeMeetiInformation(slug) {
		const meetiModel = await this.Meeti.findOne({
			where: {
				slug,
			},
			// attributes: ["slug", "title", "date", "time", "id"],
			order: [
				["date", "ASC"]
			],
			include: [{
				model: this.Groups,
				// attributes: ["image"]
			}, {
				model: this.User,
				// attributes: ['id', 'name', 'pfp']
			}, {
				model: this.Address
			}]
		});
		
		// If the meeti wasn't found return undefined
		if(!meetiModel) {
			return;
		}
		
		const meeti = await this.obtainMeetiParticipants(meetiModel);
		
		return meeti;
	}
	
	/**
	 * Meeti and participants
	 * 
	 * Options:
	 * - meetisTime:
	 * Filter meetis for the given time
	 * 
	 * Possible values are: all, past, future
	 */
	async meetiAndParticipants(options = {
		meetisTime: "all"
	}) {
		let meetiModels = undefined;
		const userId = Number(this.user.id);
		switch(options.meetisTime) {
			case "past": {
				meetiModels = await this.Meeti.findAll({
					where: {
						date: {
							[Op.lt]: moment(new Date()).format("YYYY-MM-DD")
						},
						userId,
					},
					order: [
						["date", "ASC"]
					]
				});
				break;
			}
			case "future": {
				meetiModels = await this.Meeti.findAll({
					where: {
						date: {
							[Op.gte]: moment(new Date()).format("YYYY-MM-DD")
						},
						userId,
					},
					order: [
						["date", "ASC"]
					]
				});
				break;
			}
			default: {
				// Considered all too
				meetiModels = await this.Meeti.findAll({
					where: {
						userId
					},
					order: [
						["date", "ASC"]
					]
				});
				break;
			}
		}
		
		// Find meeti particpants
		let meetis = [ ];
		for(const meetiModel of meetiModels) {
			const meeti = await this.obtainMeetiParticipants(meetiModel);
			meetis.push(meeti);
		}
		
		return meetis;
	}
}
