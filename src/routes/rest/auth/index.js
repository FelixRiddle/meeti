const express = require('express');
const registerRouter = require('./register');
const loginRouter = require('./login');

const authRouter = express.Router();

authRouter.use("/login", loginRouter);
authRouter.use("/register", registerRouter);

module.exports = authRouter;
