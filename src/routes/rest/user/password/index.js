const express = require("express");
const resetRouter = require("./reset");

const passwordRouter = express.Router();

passwordRouter.use("/reset", resetRouter);

module.exports = passwordRouter;
