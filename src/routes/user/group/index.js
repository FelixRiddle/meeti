const express = require("express");
const newRouter = require("./new");
const editRouter = require("./edit");
const imageRouter = require("./image");

const groupRouter = express.Router();

groupRouter.use(
	"/image",
	imageRouter
);
groupRouter.use("/edit", editRouter);
groupRouter.use("/new", newRouter);

module.exports = groupRouter;
