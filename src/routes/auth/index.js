const express = require("express");

const notAuthenticated = require("../../lib/auth/notAuthenticated");
const registerRouter = require("./register");
const loginRouter = require("./login");
const confirmEmailRouter = require("./confirmEmail");

const authRouter = express.Router();

authRouter.use("/confirm-email", notAuthenticated, confirmEmailRouter);
authRouter.use("/register", notAuthenticated, registerRouter);
authRouter.use("/login", notAuthenticated, loginRouter);

module.exports = authRouter;
