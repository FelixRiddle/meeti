const Sequelize = require("sequelize");

// CREATE TABLE "session" (
// 	"sid" varchar NOT NULL COLLATE "default",
// 	"sess" json NOT NULL,
// 	"expire" timestamp(6) NOT NULL
// )
// WITH (OIDS=FALSE);

// ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

// CREATE INDEX "IDX_session_expire" ON "session" ("expire");

/**
 * Create category model
 * 
 * I don't know how to translate the rest of the things, gonna leave it here not to be used.
 * 
 * @deprecated
 */
function createSessionModel(conn, SocialCategory, User) {
	const Groups = conn.define("groups", {
		sic: {
			type: Sequelize.STRING(64),
			primaryKey: true,
			allowNull: false,
		},
		sess: {
			type: Sequelize.JSON,
			allowNull: false,
		},
		expire: {
			type: Sequelize.TIME,
			allowNull: false,
		}
	});
	
	Groups.belongsTo(SocialCategory);
	Groups.belongsTo(User);
	
	return Groups;
}

module.exports = createGroupsModel;
