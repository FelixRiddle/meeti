const express = require("express");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const expandData = require("../../../../lib/misc/expandData");

const participateRouter = express.Router();

participateRouter.post("/", async (req, res) => {
	try {
		const {
			MeetiParticipants
		} = req.models;
		
		const participantInfo = req.body;
		
		await MeetiParticipants.create({
			meetiId: participantInfo.meetiId,
			// We've gotta use it from req otherwise a bad actor could subscribe anyone to anything
			userId: req.user.id,
		});
		
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

module.exports = participateRouter;
