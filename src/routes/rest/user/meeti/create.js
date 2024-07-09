const express = require('express');
const { validationResult } = require('express-validator');
const color = require("ansi-color");

const CREATE_MEETI_VALIDATION = require('../../../../lib/routes/validation/createMeetiValidation');
const expandData = require('../../../../lib/misc/expandData');
const { renderDataInternalErrorMessage } = require('../../../../lib/status/messages');

const createMeetiRouter = express.Router();

createMeetiRouter.post(
	"/",
	CREATE_MEETI_VALIDATION,
	async(req, res) => {
		try {
			console.log(`[POST] /rest/user/meeti/create`);
			const {
				Address,
				Meeti,
				User,
				Groups,
			} = req.models;
			
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
				const groups = await Groups.findAll({
					where: {
						userId: req.user.id
					},
					raw: true,
				});
				
				const extraData = await expandData(req);
				return res.status(400).send({
					title: "Create Meeti",
					groups,
					...extraData,
				});
			}
			
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
			
			const message = "Meeti created";
			console.log(color.set(message, 'green'));
			req.flash("messages", [{
				message,
				type: "success"
			}]);
			
			const extraData = await expandData(req);
			return res.send({
				...extraData
			});
		} catch(err) {
			console.error(err);
			
			console.log(color.set(err.message, 'red'));
			
			return res.status(500)
				.send({
					...renderDataInternalErrorMessage
				});
		}
	}
);

module.exports = createMeetiRouter;
