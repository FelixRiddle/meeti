const express = require("express");
const newRouter = require("./new");
const getAllRouter = require("./getAll");
const editRouter = require("./edit");

const groupRouter = express.Router();

groupRouter.use("/edit", editRouter);
groupRouter.use("/getAll", getAllRouter);
groupRouter.use("/new", newRouter);

module.exports = groupRouter;
