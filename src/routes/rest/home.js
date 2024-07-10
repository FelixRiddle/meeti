const express = require("express");
const moment = require("moment");

const expandData = require("../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../lib/status/messages");

const homeRouter = express.Router();

homeRouter.get("/", async(req, res) => {
	try {
		const {
			Groups,
			Meeti,
			SocialCategory,
		} = req.models;
		
		const [
			categories,
			meetis
		] = await Promise.all([
			SocialCategory.findAll(),
			Meeti.findAll({
				where: {
					date: {
						[Op.gte]: moment(new Date()).format("YYYY-MM-DD")
					}
				},
				attributes: [
					"slug", "title", "date", "time"
				],
				limit: 3,
				order: [
					["date", "ASC"]
				],
				include: [{
					model: Groups,
					attributes: ["image"]
				}, {
					model: User,
					attributes: ['name', 'pfp']
				}]
			})
		]);
		
		const extraData = await expandData(req);
		return res.send({
			...extraData,
			categories,
			meetis
		});
	} catch(err) {
		console.error(err);
		const extraData = await expandData(req);
		return res.status(500)
			.send({
				...extraData,
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = homeRouter;
