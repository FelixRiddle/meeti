const Sequelize = require("sequelize");
const bcrypt = require('bcrypt');

/**
 * Hash passsword
 */
function hashPassword(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

/**
 * User model
 */
function createUserModel(conn) {
	const User = conn.define('user', {
		id: {
			type: Sequelize.BIGINT,
			primaryKey :true,
			autoIncrement: true,
		},
		name: {
			type: Sequelize.STRING(64)
		},
		description: {
			type: Sequelize.TEXT,
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
				user.password = hashPassword(user.password);
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
	
	User.prototype.hashPassword = hashPassword;
	
	return User;
}

module.exports = createUserModel;
