const express = require("express");

const expandData = require("../../../lib/misc/expandData");
const profilePicture = require("../../../lib/uploads/user/profilePicture");

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

pictureRouter.post("/", profilePicture, async(req, res) => {
	try {
		const {
			User
		} = req.models;
		
		// Guard that there's file
		if(!req.file) {
			req.flash("messages", [{
				message: "Upload an image",
				type: "error"
			}]);
			
			const expanded = await expandData(req);
			return res
				.render("user/profile/picture", {
					title: "Profile picture",
					...expanded,
					user,
				});
		}
		
		// User information
		const user = await User.findByPk(req.user.id);
		
		// Lastly update user pfp
		user.pfp = req.file.filename;
		await user.save();
		
		return res.redirect("back");
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = pictureRouter;
