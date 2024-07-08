const express = require("express");

const notAuthenticated = require("../../lib/auth/notAuthenticated");
const registerRouter = require("./register");
const loginRouter = require("./login");
const confirmEmailRouter = require("./confirmEmail");

/**
 * Auth router
 */
function authRouter(passport) {
	const router = express.Router();

	router.use("/confirm-email", notAuthenticated, confirmEmailRouter);
	router.use("/login", notAuthenticated, loginRouter(passport));
	router.use("/register", notAuthenticated, registerRouter());
	
	return router;
}

module.exports = authRouter;
