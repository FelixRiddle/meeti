const express = require("express");
const authRouter = require("./auth");

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);

const renderHome = (req, res) => {
	return res.render("home");
}
mainRouter.get("/home", renderHome);
mainRouter.get("/", renderHome);

module.exports = mainRouter;
