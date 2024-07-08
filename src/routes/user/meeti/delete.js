const express = require("express");
const expandData = require("../../../lib/misc/expandData");

const deleteRouter = express.Router();

deleteRouter.get("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		const {
			Meeti
		} = req.models;
		
		const meeti = await Meeti.findByPk(meetiId, {
			where: {
				userId: req.user.id,
			},
			raw: true,
		});
		
		if(!meeti) {
			req.flash("messages", [{
				message: "Either the Meeti doesn't exists or you don't own it",
				type: "error"
			}]);
			
			return res
				.status(401)
				.render("/status");
		}
		
		return res.render("user/meeti/delete", {
			title: `Delete ${meeti.title}`,
			...expandData(req),
			meeti,
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.redirect("/500");
	}
});

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
				.render("/status");
		}
		
		req.flash("messages", [{
			message: "Meeti deleted",
			type: "success"
		}]);
		
	} catch(err) {
		console.error(err);
		return res.status(500)
			.redirect("/500");
	}
});

module.exports = deleteRouter;
