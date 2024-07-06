const Sequelize = require("sequelize");

/**
 * Meeti assistants
 */
function createMeetiParticipantsModel(conn, Meeti, User) {
	const MeetiParticipants = conn.define("meeti-participants", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
	});
	
	Meeti.belongsToMany(User, { through: MeetiParticipants });
	User.belongsToMany(Meeti, { through: MeetiParticipants });
	
	return MeetiParticipants;
}

module.exports = createMeetiParticipantsModel;
