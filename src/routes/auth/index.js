const express = require("express");
const registerRouter = require("./register");
const loginRouter = require("./login");

const authRouter = express.Router();

authRouter.use("/register", registerRouter);
authRouter.use("/login", loginRouter);

module.exports = authRouter;
