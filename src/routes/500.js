const express = require("express");
const expandData = require("../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../lib/status/messages");

const error500Router = express.Router();

error500Router.get("/", (req, res) => {
	return res
		.status(500)
		.render("status", {
			title: "Error 500: Internal error",
			...renderDataInternalErrorMessage,
			...expandData(req),
		});
});

module.exports = error500Router;
