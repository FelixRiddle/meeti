const express = require('express');
const expandData = require('../../../../lib/misc/expandData');
const { renderDataInternalErrorMessage } = require('../../../../lib/status/messages');

const deleteRouter = express.Router();

deleteRouter.post("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		const {
			Meeti
		} = req.models;
		
		const meeti = await Meeti.findByPk(meetiId, {
			where: {
				userId: req.user.id,
			}
		});
		
		if(!meeti) {
			req.flash("messages", [{
				message: "Either the Meeti doesn't exists or you don't own it",
				type: "error"
			}]);
			
			return res
				.status(401)
				.send({
					...expandData(req)
				});
		}
		
		await meeti.destroy();
		
		req.flash("messages", [{
			message: "Meeti deleted",
			type: "success"
		}]);
		
		return res
			.send({
				...expandData(req)
			});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = deleteRouter;
