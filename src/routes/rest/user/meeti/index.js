const express = require("express");
const createMeetiRouter = require("./create");

const meetiRouter = express.Router();

meetiRouter.use("/create", createMeetiRouter);

module.exports = meetiRouter;
