const express = require("express");
const newRouter = require("./new");
const getAllRouter = require("./getAll");

const groupRouter = express.Router();

groupRouter.use("/getAll", getAllRouter);
groupRouter.use("/new", newRouter);

module.exports = groupRouter;
