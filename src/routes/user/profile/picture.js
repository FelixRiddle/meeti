const express = require("express");
const expandData = require("../../../lib/misc/expandData");

const pictureRouter = express.Router();

pictureRouter.get("/", async (req, res) => {
	try {
		const expanded = await expandData(req, { useSession: false });
		return res
			.render("user/profile/picture", {
				title: "Profile picture",
				...expanded
			});
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = pictureRouter;
