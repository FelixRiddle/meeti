const Sequelize = require("sequelize");

/**
 * Create category model
 */
function createCommentModel(conn, User, Meeti) {
	const Comment = conn.define("comment", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		message: {
			type: Sequelize.TEXT,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "A comment is required"
				}
			}
		},
	}, {
		tableName: "comment"
	});
	
	Comment.belongsTo(User);
	Comment.belongsTo(Meeti);
	
	return Comment;
}

module.exports = createCommentModel;
