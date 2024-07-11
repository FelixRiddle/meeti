const express = require("express");

const participateRouter = express.Router();

participateRouter.post("/:meetiId", async (req, res) => {
	try {
		const {
			MeetiParticipants
		} = req.models;
		
		const participantInfo = req.body;
		
		console.log(`Participant info: `, participantInfo);
		
		await MeetiParticipants.create(participantInfo);
		
		return res.redirect(`/meeti/${req.params.meetiId}`);
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = participateRouter;
