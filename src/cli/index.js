const { ArgumentParser } = require("argparse");
const dotenv = require("dotenv");

dotenv.config({
	path: ".env"
});

const startServer = require("../server");
const Models = require("../models/Models");

const parser = new ArgumentParser({
	description: "Meeti"
});

parser.add_argument("--start-server", {
	action: "store_true",
	help: "Start server"
});

parser.add_argument("--reset-tables", {
	action: "store_true",
	help: "Reset tables"
});

/**
 * Run commands
 */
async function runCommands() {
	const args = parser.parse_args();
	
	// Initialize sequelize models
	const sequelizeModels = new Models();
	await sequelizeModels.sync();
	
	if(args.reset_table) {
		await seedSocialCategory(sequelizeModels);
	}
	
	if(args.start_server) {
		await startServer(sequelizeModels);
	}
}

module.exports = runCommands;
