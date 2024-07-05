const Sequelize = require("sequelize");
const shortid = require("shortid");
const slug = require("slug");

/**
 * Create category model
 */
function createMeetiModel(conn, User, Group, Address) {
	const Meeti = conn.define("meeti", {
		id: {
			type: Sequelize.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		title: {
			type: Sequelize.STRING(256),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Title cannot be empty"
				}
			}
		},
		featuring: {
			type: Sequelize.STRING(256),
		},
		coupon: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "The description can't be empty"
				}
			}
		},
		date: {
			type: Sequelize.DATEONLY,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Add a date for the Meeti"
				}
			}
		},
		time: {
			type: Sequelize.TIME,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Add a time for the Meeti"
				}
			}
		},
		slug: {
			type: Sequelize.STRING,
		}
	}, {
		hooks: {
			async beforeCreate(meeti) {
				const title = meeti.title.toLowerCase();
				const url = slug(`${title}-${shortid.generate()}`);
				meeti.slug = url;
			}
		}
	});
	
	Meeti.belongsToMany(User, { through: "junction-user-meeti" });
	Meeti.belongsTo(Group);
	Meeti.belongsTo(Address);
	
	return Meeti;
}

module.exports = createMeetiModel;
