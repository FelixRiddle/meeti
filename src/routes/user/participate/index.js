const express = require("express");

const participateRouter = express.Router();

participateRouter.post("/", async (req, res) => {
	try {
		const {
			MeetiParticipants
		} = req.models;
		
		const participantInfo = req.body;
		
		// Check if the user is participating already
		const userFound = await MeetiParticipants.findOne({
			where: {
				// We need to filter by these two
				meetiId: participantInfo.meetiId,
				userId: req.user.id
			}
		});
		if(userFound) {
			// Remove user
			await userFound.destroy();
		} else {
			// Add user
			await MeetiParticipants.create({
				meetiId: participantInfo.meetiId,
				// We've gotta use it from req otherwise a bad actor could subscribe anyone to anything
				userId: req.user.id,
			});
		}
		
		return res.redirect('back');
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = participateRouter;
