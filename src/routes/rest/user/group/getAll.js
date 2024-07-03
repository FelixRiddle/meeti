const express = require("express");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");

const getAllRouter = express.Router();

getAllRouter.get("/", async (req, res) => {
	try {
		const Groups = req.models.Groups;
		const groups = await Groups.findAll({
			where: {
				userId: req.user.id
			}
		});
		
		return res.send({
			groups
		});
	} catch(err) {
		console.error(err);
		return res.status(500).send({
			...renderDataInternalErrorMessage
		});
	}
})

module.exports = getAllRouter;
