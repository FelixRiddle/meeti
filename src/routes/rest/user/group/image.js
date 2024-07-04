const express = require('express');
const fs = require("fs");
const color = require("ansi-color");

const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../../lib/status/messages');
const userGroupRest = require('../../../../lib/middleware/rest/userGroupRest');
const restUploadGroupImage = require('../../../../lib/uploads/rest/restUploadGroupImage');

const imageRouter = express.Router();

imageRouter.post(
	"/:groupId",
	// Upload image, decode multipart form data
	// FIXME: This is for the frontend
	restUploadGroupImage,
	// Validate group exists and the user owns it
	userGroupRest,
	async (req, res) => {
		try {
			const group = req.group;
			
			const file = req.file;
			
			// Validate a file was given
			const filename = file ? file.filename : "";
			if(!filename) {
				// TODO: This can be made into a function
				const message = "No image given";
				console.log(color.set(message, "red"));
				
				req.flash('messages', [{
					message,
					type: "error",
				}]);
				
				return res
					.status(400)
					.send({
						...expandData(req),
					});
			}
			
			// Remove previous image
			if(group.image) {
				fs.rmSync(`public/uploads/groups/${group.image}`);
			}
			
			group.image = filename;
			await group.save();
			
			// Debug
			const message = "Image updated";
			console.log(color.set(message, "green"));
			req.flash("messages", [{
				message,
				type: "success",
			}]);
			
			return res
				.send({
					...expandData(req),
				});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.render("status", {
					...renderDataInternalErrorMessage,
				});
		}
	}
);

module.exports = imageRouter;
