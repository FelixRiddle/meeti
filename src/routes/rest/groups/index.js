const express = require("express");

const moment = require("moment");
const expandData = require("../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../../lib/status/messages");

const groupsRouter = express.Router();

groupsRouter.get("/:id", async(req, res) => {
	try {
		const {
			Groups,
			Meeti,
		} = req.models;
		
		const groupId = req.params.id;
		
		const [group, meetis] = await Promise.all([
			Groups.findByPk(groupId, {
				raw: true,
			}),
			Meeti.findAll({
				where: {
					groupId
				},
				raw: true,
			})
		]);
		
		if(!group) {
			req.flash("messages", [{
				message: "Group doesn't exists",
				type: "error"
			}]);
			
			const extra = await expandData(req);
			return res
				.status(404)
				.send({
					...extra,
				});
		}
		
		const extra = await expandData(req);
		return res.send({
			...extra,
			title: `Showing group ${group.name}`,
			group,
			meetis: meetis ? meetis : [],
			moment,
		});
	} catch(err) {
		console.error(err);
		const extra = await expandData(req);
		return res.status(500)
			.send({
				...extra,
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = groupsRouter;
