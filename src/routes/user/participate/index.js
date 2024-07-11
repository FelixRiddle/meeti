const express = require("express");

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
		
		return res.redirect('back');
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = participateRouter;
