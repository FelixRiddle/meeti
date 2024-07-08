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
				.redirect("/user/admin");
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

editRouter.post("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		console.log(`[POST] /user/meeti/edit/${meetiId}`);
		
		const {
			Address,
			Meeti
		} = req.models;
		
		// Get model
		const meetiModel = await Meeti.findByPk(meetiId);
		if(!meetiModel) {
			const message = "Meeti does not exists";
			console.log(color.set(message, "red"));
			
			req.flash('messages', [{
				message,
				type: "error"
			}]);
			
			return res
				.status(404)
				.redirect("/user/admin");
		}
		
		const data = {
			...req.body,
		};
		
		// Retrieve those I need
		const {
			latitude,
			longitude,
			street,
			city,
			state,
			country
		} = data;
		delete data.latitude;
		delete data.longitude;
		delete data.street;
		delete data.city;
		delete data.state;
		delete data.country;
		
		// Replace previous data
		Object.assign(meetiModel, data);
		
		// Find address and update
		const meetiAddress = await Address.findOne({
			where: {
				id: meetiModel.addressId
			}
		});
		Object.assign(
			meetiAddress,
			{
				latitude,
				longitude,
				street,
				city,
				state,
				country,
			}
		);
		
		await Promise.all([
			meetiModel.save(),
			meetiAddress.save(),
		]);
		
		return res.redirect("/user/admin");
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = editRouter;
