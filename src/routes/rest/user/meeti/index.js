const express = require("express");

const meetiRouter = express.Router();

meetiRouter.use("/create", meetiRouter);

module.exports = meetiRouter;
