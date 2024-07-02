const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

dotenv.config({
	path: ".env"
});

// All impotyd should be after dotenv initialization
// So that they can read environment variables
const { PORT } = require("./lib/config/env");
const mainRouter = require("./routes");
const Models = require("./models/Models");
const passport = require("./lib/config/passport");

// Initialize sequelize models
const sequelizeModels = new Models();

exports.sequelizeModels = sequelizeModels;

/**
 * Main function
 */
async function main() {
	await sequelizeModels.sync();
	
	const app = express();
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	
	app.use(cookieParser());
	app.use(session({
		secret: process.env.SECRET_KEY,
		key: process.env.SECRET_KEY_NAME,
		resave: false,
		saveUninitialized: false,
	}));
	
	app.use(passport.initialize())
	
	// Agregate flash
	app.use(flash());
	
	// Enable EJS
	app.use(expressEjsLayouts);
	app.set("view engine", "ejs");
	app.set(`views`, `${process.cwd()}/views`);
	
	app.use("/public", express.static("public"));
	
	// Middleware(user logged in, flash messages)
	app.use((req, res, next) => {
		res.locals.messages = req.flash();
		req.models = sequelizeModels;
		
		const date = new Date();
		res.locals.year = date.getFullYear();
		
		next();
	});
	
	// Routes
	app.use(mainRouter);
	
	app.listen(PORT, () => {
		console.log(`Server listening at http://localhost:${PORT}`);
	});
}

main();
