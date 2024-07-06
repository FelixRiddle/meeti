const { Op } = require("sequelize");

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
	 * Meeti and participants
	 */
	async meetiAndParticipants() {
		const meetiModels = await this.Meeti.findAll({
			where: {
				userId: this.user.id
			},
		});
		
		// Find meeti particpants
		let meetis = [ ];
		for(const meetiModel of meetiModels) {
			const meeti = JSON.parse(JSON.stringify(meetiModel));
			const participantIds = await this.MeetiParticipants.findAll({
				where: {
					meetiId: meeti.id,
				},
				raw: true,
			});
			
			meeti.participants = await this.User.findAll({
				where: {
					userId: {
						// Find an array of participants
						[Op.or]: participantIds,
					}
				},
				raw: true,
			});
			
			meetis.push(meeti);
		}
		
		return meetis;
	}
}
