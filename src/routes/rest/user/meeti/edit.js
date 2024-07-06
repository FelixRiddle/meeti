const express = require("express");
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
		
		const groups = await Groups.findAll({
			where: {
				userId: req.user.id
			}
		});
		const meetiModel = await Meeti.findByPk(meetiId);
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
