const express = require("express");
const createMeetiRouter = require("./create");
const editRouter = require("./edit");

const meetiRouter = express.Router();

meetiRouter.use("/edit", editRouter);
meetiRouter.use("/create", createMeetiRouter);

module.exports = meetiRouter;
