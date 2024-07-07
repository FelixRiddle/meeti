const seedSocialCategory = require("../lib/seed/socialCategory");

/**
 * Tables commands
 */
module.exports = async function tablesCmds(args, sequelizeModels) {
	if(args.reset_tables) {
		console.log(`Reset tables`);
		await sequelizeModels.dropAll();
		await sequelizeModels.sync();
		await seedSocialCategory(sequelizeModels);
		console.log(`Tables reset`);
	}
}
