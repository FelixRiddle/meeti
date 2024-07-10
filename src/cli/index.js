const { ArgumentParser } = require("argparse");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config({
	path: ".env"
});

const startServer = require("../server");
const Models = require("../models/Models");
const tablesCmds = require("./tables");

/**
 * Create public directories
 */
function createPublicDirectories() {
	// Create public folder
	const publicFolder = path.join(process.cwd(), 'public');
	if (!fs.existsSync(publicFolder)) {
		fs.mkdirSync(publicFolder);
	}
	
	// Uploads
	const uploadsFolder = path.join(publicFolder, 'uploads');
	if (!fs.existsSync(uploadsFolder)) {
		fs.mkdirSync(uploadsFolder);
	}
	
	// User
	const userFolder = path.join(publicFolder, 'user');
	if (!fs.existsSync(userFolder)) {
		fs.mkdirSync(userFolder);
	}
}

/**
 * Parse arguments
 */
function parseArguments() {
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
	
	const subparsers = parser.add_subparsers();
	const tableParser = subparsers.add_parser("table", {
		help: "Table manipulation"
	});
	
	tableParser.add_argument("--reset", {
		action: "store_true",
		help: "Reset tables"
	});
	
	return parser;
}

/**
 * Run commands
 */
async function runCommands() {
	// Check environment variable and set
	const nodeEnv = process.env.NODE_ENV;
	if(!nodeEnv) {
		// Set to development
		process.env.NODE_ENV = 'development';
	}
	
	// Directories
	createPublicDirectories();
	
	// Arguments
	const parser = parseArguments();
	const args = parser.parse_args();
	
	// Initialize sequelize models
	const sequelizeModels = new Models();
	await sequelizeModels.sync();
	
	if(args.start_server) {
		await startServer(sequelizeModels);
	}
	
	tablesCmds(args, sequelizeModels);
	
	// TODO: Be capable of using subcommands
	// const tableArgs = tableParser.parse_args();
}

module.exports = runCommands;
