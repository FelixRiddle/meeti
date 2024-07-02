const express = require('express');
const expandData = require("../../../lib/misc/expandData");

const newRouter = express.Router();

newRouter.get("/", (req, res) => {
	return res.render("user/group/new", {
		title: "Create new group",
		...expandData(req),
	});
});

module.exports = newRouter;
