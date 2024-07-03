const express = require("express");
const newRouter = require("./new");
const editRouter = require("./edit");

const groupRouter = express.Router();

groupRouter.use("/edit", editRouter);
groupRouter.use("/new", newRouter);

module.exports = groupRouter;
