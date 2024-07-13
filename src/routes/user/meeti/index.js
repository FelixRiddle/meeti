const express = require("express");

const commentRouter = require("./comment");
const createMeetiRouter = require("./create");
const deleteRouter = require("./delete");
const editRouter = require("./edit");

const meetiRouter = express.Router();

meetiRouter.use("/comment", commentRouter);
meetiRouter.use("/create", createMeetiRouter);
meetiRouter.use("/delete", deleteRouter);
meetiRouter.use("/edit", editRouter);

module.exports = meetiRouter;
