const Sequelize = require("sequelize");

/**
 * Create category model
 */
function createAddressModel(conn) {
	const Address = conn.define("address", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		street: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Address is required"
				}
			}
		},
		city: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "City is required",
				}
			}
		},
		state: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "State is required",
				}
			}
		},
		country: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Country is required",
				}
			}
		},
		// Doesn't work on my computer
		// Even when doing create extension postgis on postgress
		// coordinates: {
		// 	type: Sequelize.GEOMETRY("POINT"),
		// },
		latitude: {
			type: Sequelize.DOUBLE
		},
		longitude: {
			type: Sequelize.DOUBLE,
		}
	});
	
	return Address;
}

module.exports = createAddressModel;
