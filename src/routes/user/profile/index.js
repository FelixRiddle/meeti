const express = require("express");

const editRouter = require("./edit");
const expandData = require("../../../lib/misc/expandData");

const profileRouter = express.Router();

profileRouter.use("/edit", editRouter);

profileRouter.get("/:userId", async (req, res) => {
	try {
		
		return res.render("user/profile/show", {
			...expandData(req)
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = profileRouter;
