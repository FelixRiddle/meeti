const express = require('express');
const fs = require("fs");
const color = require("ansi-color");

const expandData = require("../../../lib/misc/expandData");
const uploadGroupImage = require('../../../lib/uploads/uploadGroupImage');
const groupExistsUserOwnsIt = require('../../../lib/middleware/groupExistsUserOwnsIt');

const imageRouter = express.Router();

imageRouter.get(
	"/:groupId",
	groupExistsUserOwnsIt,
	uploadGroupImage,
	async (req, res) => {
		try {
			const groupModel = req.group;
			
			// Make it raw
			const group = groupModel.get({ raw: true });
			
			const extraData = await expandData(req);
			return res
				.render("user/group/image", {
					title: "Change image",
					...extraData,
					group
				});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.redirect("500");
		}
	}
);

imageRouter.post(
	"/:groupId",
	// Upload image, decode multipart form data
	uploadGroupImage,
	// Validate group exists and the user owns it
	groupExistsUserOwnsIt,
	async (req, res) => {
		try {
			const group = req.group;
			
			const file = req.file;
			
			// Validate a file was given
			const filename = file ? file.filename : "";
			if(!filename) {
				const message = "No image given";
				console.log(color.set(message, "red"));
				
				req.flash('messages', [{
					message,
					type: "error",
				}]);
				
				const extraData = await expandData(req);
				return res
					.render(`user/group/image/${group.id}`, {
						title: "Change image",
						...extraData,
					});
			}
			
			// Remove previous image
			if(group.image) {
				fs.rmSync(`public/uploads/groups/${group.image}`);
			}
			
			group.image = filename;
			await group.save();
			
			req.flash("messages", [{
				message: "Image updated",
				type: "success",
			}]);
			
			return res
				.redirect("/user/admin");
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.redirect("500");
		}
	}
);

module.exports = imageRouter;
