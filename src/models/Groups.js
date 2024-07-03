const Sequelize = require("sequelize");

/**
 * Create category model
 */
function createGroupsModel(conn, SocialCategory, User) {
	const Groups = conn.define("groups", {
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: Sequelize.STRING(256),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "The group must have name"
				}
			}
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true,
			validate: {
				notEmpty: {
					msg: "Description can't be empty"
				}
			}
		},
		url: Sequelize.TEXT,
		image: Sequelize.STRING(64)
	});
	
	Groups.belongsTo(SocialCategory);
	Groups.belongsTo(User);
	
	return Groups;
}

module.exports = createGroupsModel;
