const express = require("express");

const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const expandData = require("../../../../lib/misc/expandData");
const createMeetiRouter = require("./create");
const editRouter = require("./edit");

const meetiRouter = express.Router();

meetiRouter.use("/create", createMeetiRouter);
meetiRouter.use("/edit", editRouter);

meetiRouter.get("/:meetiId", async (req, res) => {
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
			
			const extraData = await expandData(req);
			return res
				.status(401)
				.send({
					...extraData
				});
		}
		
		return res.send({
			title: `Delete ${meeti.title}`,
			...extraData,
			meeti,
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

meetiRouter.delete("/:meetiId", async (req, res) => {
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
				.send({
					...extraData
				});
		}
		
		await meeti.destroy();
		
		req.flash("messages", [{
			message: "Meeti deleted",
			type: "success"
		}]);
		
		const extraData = await expandData(req);
		return res
			.send({
				...extraData
			});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = meetiRouter;
