const express = require("express");
const expandData = require("../lib/misc/expandData");

const error500Router = express.Router();

error500Router.get("/", (req, res) => {
	return res
		.status(500)
		.render("status", {
			...renderDataInternalErrorMessage,
			...expandData(req),
		});
});

module.exports = error500Router;
