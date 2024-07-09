const express = require("express");

const pictureRouter = express.Router();

pictureRouter.post("/", async (req, res) => {
	try {
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = pictureRouter;
