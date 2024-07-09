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
		
		// Parts of this may be automatized
		// 1) The rendering is always the endpoint of the server
		// 2) And you want to get 'expandData' on every endpoint
		const extraData = await expandData(req);
		return res.render("user/meeti/delete", {
			title: `Delete ${meeti.title}`,
			...extraData,
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
			
			const extraData = await expandData(req);
			return res
				.status(401)
				.render("/status", {
					extraData
				});
		}
		
		await meeti.destroy();
		
		req.flash("messages", [{
			message: "Meeti deleted",
			type: "success"
		}]);
		
		return res.redirect("/user/admin");
	} catch(err) {
		console.error(err);
		return res.status(500)
			.redirect("/500");
	}
});

module.exports = deleteRouter;
