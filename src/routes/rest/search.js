const express = require('express');
const moment = require("moment");
const Sequelize = require("sequelize");
const expandData = require('../../lib/misc/expandData');

const Op = Sequelize.Op;

const searchRouter = express.Router();

searchRouter.post("/", async(req, res) => {
	try {
		const {
			Address,
			Groups,
			Meeti,
			User,
		} = req.models;
		
		const {
			title,
			city,
			country,
			category
		} = req.body;
		
		console.log(`Given data: `, req.body);
		
		let query = {};
		if(category) {
			// If there's no category find all without filtering categories
			query = {
				socialCategoryId: Number(category)
			};
		}
		
		const meetis = await Meeti.findAll({
			where: {
				title: {
					// iLike(case insensitive like, only works for postgres)
					[Op.iLike]: `%${title}%`,
				},
			},
			include: [{
				model: Groups,
				where: query
			}, {
				model: User,
			}, {
				model: Address,
				where: {
					city: {
						[Op.iLike]: `%${city}%`,
					},
					country: {
						[Op.iLike]: `%${country}%`,
					}
				}
			}]
		});
		
		const extra = await expandData(req);
		return res.send({
			...extra,
			title: `Search for ${title}`,
			meetis,
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

module.exports = searchRouter;
