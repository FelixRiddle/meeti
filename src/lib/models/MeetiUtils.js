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
			Groups,
			Meeti,
			MeetiParticipants,
			User,
		} = Models;
		this.Groups = Groups;
		this.Meeti = Meeti;
		this.MeetiParticipants = MeetiParticipants;
		this.User = User;
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
		meeti.participants = await Promise.all(participantIds.map((id) => {
			return User.findAll({
				where: {
					id,
				},
				raw: true,
			});
		}));
		
		// Doesn't work
		// meeti.participants = await this.User.findAll({
		// 	where: {
		// 		userId: {
		// 			// Find an array of participants
		// 			// [Op.values]: participantIds,
		// 			[Op.values]: [1]
		// 		}
		// 	},
		// 	raw: true,
		// });
		
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
