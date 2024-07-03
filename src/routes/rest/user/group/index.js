const express = require("express");
const newRouter = require("./new");

const groupRouter = express.Router();

groupRouter.use("/new", newRouter);

module.exports = groupRouter;
