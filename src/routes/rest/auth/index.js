const express = require('express');
const registerRouter = require('./register');

const authRouter = express.Router();

authRouter.use("/register", registerRouter);

module.exports = authRouter;
