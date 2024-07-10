const bodyParser = require("body-parser");
const express = require("express");
const expressEjsLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { PORT } = require("../lib/config/env");
const mainRouter = require("../routes");
const passportInstance = require("../lib/config/passport");

/**
 * Main function
 */
async function startServer(sequelizeModels) {
	const app = express();
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(cookieParser(process.env.SECRET_KEY));
	
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
	
	// Passport
	const passport = passportInstance(sequelizeModels);
	app.use(passport.initialize());
	// I've forgot to put this one before
	app.use(passport.session());
	
	// Use flash
	app.use(flash());
	
	app.use(cors({
		origin: function(origin, callback) {
			let frontUrl = process.env.FRONTEND_URL;
			if(!frontUrl && process.env.NODE_ENV === 'development') {
				// NextJS frontend
				frontUrl = "http://localhost:3007";
			}
			
			return callback(null, [
				frontUrl,
			]);
		}
	}));
	
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
	app.use(mainRouter(passport));
	
	app.listen(PORT, () => {
		console.log(`Server listening at http://localhost:${PORT}`);
	});
}

module.exports = startServer;
