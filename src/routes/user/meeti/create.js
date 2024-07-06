const express = require('express');
const expandData = require('../../../lib/misc/expandData');
const CREATE_MEETI_VALIDATION = require('../../../lib/routes/validation/createMeetiValidation');
const { validationResult } = require('express-validator');

const createMeetiRouter = express.Router();

createMeetiRouter.get("/", async (req, res) => {
	try {
		const Groups = req.models.Groups;
		const groups = await Groups.findAll({
			where: {
				userId: req.user.id
			},
			raw: true,
		});
		
		return res.render("user/meeti/create", {
			title: "Create Meeti",
			groups,
			...expandData(req),
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

createMeetiRouter.post(
	"/",
	CREATE_MEETI_VALIDATION,
	async(req, res) => {
		try {
			// Validate data
			const result = validationResult(req);
			if(!result.isEmpty()) {
				const resultMessages = result.array();
				
				// Store messages
				const messages = resultMessages.map((data) => {
					return {
						message: data.msg,
						error: true,
						type: "error"
					}
				});
				req.flash("messages", messages);
				
				// Find user groups again
				const Groups = req.models.Groups;
				const groups = await Groups.findAll({
					where: {
						userId: req.user.id
					},
					raw: true,
				});
				
				return res.render("user/meeti/create", {
					title: "Create Meeti",
					groups,
					...expandData(req),
				});
			}
			
			const {
				Address,
				Meeti,
				User,
			} = req.models;
			const userId = req.user.id;
			
			const formData = {
				...req.body
			};
			const address = {
				street: formData.street,
				city: formData.city,
				state: formData.state,
				country: formData.country,
				latitude: formData.latitude,
				longitude: formData.longitude,
			};
			
			const addressModel = await Address.create(address);
			
			const meeti = {
				title: formData.title,
				featuring: formData.featuring,
				coupon: formData.coupon,
				description: formData.description,
				date: formData.date,
				time: formData.time,
				groupId: formData.groupId,
				addressId: addressModel.id,
				userId,
			};
			
			const user = await User.findByPk(userId);
			const meetiModel = await Meeti.create(meeti);
			await meetiModel.addUser(user);
			
			req.flash("messages", [{
				message: "Meeti created",
				type: "success"
			}]);
			
			return res.redirect("/user/admin");
		} catch(err) {
			console.error(err);
			return res.redirect('500');
		}
	}
);

module.exports = createMeetiRouter;
