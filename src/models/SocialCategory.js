const Sequelize = require("sequelize");

/**
 * Create category model
 */
function createSocialCategoryModel(conn) {
	const Category = conn.define("social-category", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nameId: {
			type: Sequelize.STRING(64),
		},
		name: Sequelize.TEXT,
	});
	
	return Category;
}

module.exports = createSocialCategoryModel;
