const express = require("express");
const expandData = require("../../../lib/misc/expandData");

const editRouter = express.Router();

editRouter.get("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		const {
			Address,
			Groups,
			Meeti,
		} = req.models;
		
		const groups = await Groups.findAll({
			where: {
				userId: req.user.id
			}
		});
		const meetiModel = await Meeti.findByPk(meetiId);
		const meeti = meetiModel.get({
			raw: true
		});
		
		meeti.address = await Address.findByPk(meeti.id, {
			raw: true,
		});
		
		return res.render("user/meeti/edit", {
			title: `Edit Meeti ${meeti.title}`,
			...expandData(req),
			groups,
			meeti,
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = editRouter;
