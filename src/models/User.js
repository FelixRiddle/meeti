const Sequelize = require("sequelize");
const bcrypt = require('bcrypt');

/**
 * User model
 */
function createUserModel(conn) {
	const User = conn.define('user', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey :true,
			autoIncrement: true,
		},
		name: {
			type: Sequelize.STRING(64)
		},
		pfp: {
			type: Sequelize.STRING(64),
		},
		email: {
			type: Sequelize.STRING(64),
			allowNull: false,
			validate: {
				isEmail: {
					msg: "Email is incorrect",
				}
			},
			unique: {
				args: true,
				msg: "The email is already registered"
			}
		},
		password: {
			type: Sequelize.STRING(64),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Password cannot be empty"
				}
			}
		},
		emailConfirmed: {
			type: Sequelize.BOOLEAN(),
			defaultValue: false,
		},
		// Token for email and password
		token: {
			type: Sequelize.STRING(64),
		},
		tokenExpires: {
			type: Sequelize.DATE,
		}
	}, {
		hooks: {
			beforeCreate(user) {
				user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
			}
		},
		logging: false,
	});
	
	/**
	 * Validate user password
	 */
	User.prototype.validatePassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	}
	
	return User;
}

module.exports = createUserModel;
