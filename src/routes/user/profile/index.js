const express = require("express");

const editRouter = require("./edit");
const expandData = require("../../../lib/misc/expandData");

const profileRouter = express.Router();

profileRouter.use("/edit", editRouter);

profileRouter.get("/", async (req, res) => {
	try {
		
		const extraData = await expandData(req, {
			useSession: false,
		});
		return res.render("user/profile/index", {
			title: "Your profile",
			...extraData
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = profileRouter;
