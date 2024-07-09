const express = require("express");

const profilePictureRest = require("../../../../lib/uploads/rest/user/profilePictureRest");
const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");

const pictureRouter = express.Router();

pictureRouter.post("/", profilePictureRest, async(req, res) => {
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
		
		req.flash("messages", [{
			message: "Profile picture updated",
			type: "success"
		}]);
		
		const extra = await expandData(req);
		return res.send({
			...extra
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = pictureRouter;
