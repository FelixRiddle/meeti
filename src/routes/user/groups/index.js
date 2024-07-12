const express = require("express");

const moment = require("moment");
const expandData = require("../../../lib/misc/expandData");

const groupsRouter = express.Router();

groupsRouter.get("/:id", async(req, res) => {
	try {
		const {
			Groups,
			Meeti,
		} = req.models;
		
		const groupId = req.params.id;
		
		const [group, meeti] = Promise.all([
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
			res.redirect('/status');
			req.flash("messages", [{
				message: "Group doesn't exists",
				type: "error"
			}]);
			
			const extra = await expandData(req);
			return res.send({
				...extra
			});
		}
		
		const extra = await expandData(req);
		return res.send({
			...extra,
			title: `Showing group ${group.name}`,
			group,
			meeti,
			moment,
		});
	} catch(err) {
		console.error(err);
		const extra = await expandData(req);
		return res.status(500)
			.send({
				...extra
			});
	}
});

module.exports = groupsRouter;
