const express = require("express");
const logoutRouter = require("./logout");

const authRoutes = express.Router();

authRoutes.use("/logout", logoutRouter);

module.exports = authRoutes;
