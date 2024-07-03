const express = require('express');
const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../../lib/status/messages');

const newRouter = express.Router();

newRouter.post(
	"/",
	// TODO: Limit body to 4096 bytes
	async (req, res) => {
		try {
			const groupData = req.body;
			
			try {
				const Groups = req.models.Groups;
				await Groups.create(groupData);
			} catch(err) {
				console.error(err);
				
				req.flash('messages', [{
					message: err.msg,
					error: true,
					type: "error"
				}]);
				
				return res
					.status(400)
					.send({
						...expandData(req),
					});
			}
			
			req.flash("messages", [{
				message: "Group created",
				error: false,
				type: "success"
			}]);
			
			return res
				.send({
					...expandData(req),
				});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.send({
					...renderDataInternalErrorMessage,
				});
		}
	}
);

module.exports = newRouter;