const express = require("express");
const color = require("ansi-color");

const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const expandData = require("../../../../lib/misc/expandData");

const editRouter = express.Router();

// Emulate get route of the frontend
editRouter.get("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		const {
			Groups,
			Meeti,
		} = req.models;
		
		// Get groups and meetis
		const [groups, meetiModel] = await Promise.all([
			Groups.findAll({
				where: {
					userId: req.user.id
				}
			}),
			Meeti.findByPk(meetiId)
		]);
		
		// Check if meeti exists
		if(!meetiModel) {
			const message = "Meeti does not exists";
			console.log(color.set(message, "red"));
			
			req.flash('messages', [{
				message,
				type: "error"
			}]);
			
			return res
				.status(404)
				.send({
					...expandData(req)
				});
		}
		
		const meeti = meetiModel.get({ raw: true });
		
		return res.send( {
			title: `Edit Meeti ${meeti.title}`,
			...expandData(req),
			groups,
			meeti,
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = editRouter;
