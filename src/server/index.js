const bodyParser = require("body-parser");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const { PORT } = require("../lib/config/env");
const mainRouter = require("../routes");
const passport = require("../lib/config/passport");

/**
 * Main function
 */
async function startServer(sequelizeModels) {
	const app = express();
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	
	const sequelizeStore = new SequelizeStore({
		db: sequelizeModels.conn,
		tableName: "session"
	});
	
	// Create table
	sequelizeStore.sync();
	
	app.use(session({
		store: sequelizeStore,
		secret: process.env.SECRET_KEY,
		key: process.env.SECRET_KEY_NAME,
		resave: false,
		saveUninitialized: true,
	}));
	
	app.use(passport.initialize());
	// I've forgot to put this one before
	app.use(passport.session());
	
	// Use flash
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

module.exports = startServer;
