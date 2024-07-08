const express = require("express");

const expandData = require("../../../lib/misc/expandData");

const editRouter = express.Router();

editRouter.get("/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		
		// Check if the user is the one editing
		const correctUser = userId === req.user.id;
		if(!correctUser) {
			req.flash("messages", [{
				message: "You cannot edit someone else's profile",
				type: 'error'
			}]);
			
			return res.redirect("/home");
		}
		
		return res.render("user/profile/edit", {
			title: "Edit profile",
			...expandData(req)
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = editRouter;
