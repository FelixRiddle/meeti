const express = require('express');
const expandData = require('../../../lib/misc/expandData');

const createMeetiRouter = express.Router();

createMeetiRouter.get("/", (req, res) => {
	return res.render("user/meeti/create", {
		title: "Create Meeti",
		...expandData(req),
	});
});

module.exports = createMeetiRouter;
