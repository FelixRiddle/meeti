const express = require("express");

const newRouter = require("./new");
const getAllRouter = require("./getAll");
const editRouter = require("./edit");
const getRouter = require("./get");
const imageRouter = require("./image");
const deleteRouter = require("./delete");

const groupRouter = express.Router();

groupRouter.use("/delete", deleteRouter);
groupRouter.use("/image", imageRouter);
groupRouter.use("/get", getRouter);
groupRouter.use("/edit", editRouter);
groupRouter.use("/getAll", getAllRouter);
groupRouter.use("/new", newRouter);

module.exports = groupRouter;
