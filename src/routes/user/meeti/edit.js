const express = require("express");
const expandData = require("../../../lib/misc/expandData");
const color = require("ansi-color");

const editRouter = express.Router();

editRouter.get("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		const {
			Address,
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
