const express = require("express");
const expandData = require("../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../lib/status/messages");

const error500Router = express.Router();

error500Router.get("/", async (req, res) => {
	const extraData = await expandData(req);
	return res
		.status(500)
		.render("status", {
			title: "Error 500: Internal error",
			...renderDataInternalErrorMessage,
			...extraData,
		});
});

module.exports = error500Router;
