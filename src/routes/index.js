const express = require("express");
const authRouter = require("./auth");

const mainRouter = express.Router();

// Middleware(user logged in, flash messages)
mainRouter.use((req, res, next) => {
	const date = new Date();
	res.locals.year = date.getFullYear();
	
	next();
});

mainRouter.use("/auth", authRouter);

const renderHome = (req, res) => {
	return res.render("home");
}
mainRouter.get("/home", renderHome);
mainRouter.get("/", renderHome);

mainRouter.use((req, res, next) => {
	return res.render("404");
});

module.exports = mainRouter;
