const express = require("express");
const color = require("ansi-color");

const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const expandData = require("../../../../lib/misc/expandData");

const editRouter = express.Router();

// Emulate get route of the frontend
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
			
			const extraData = await expandData(req);
			return res
				.status(404)
				.send({
					...extraData
				});
		}
		
		const meeti = meetiModel.get({
			raw: true
		});
		
		meeti.address = await Address.findByPk(meeti.id, {
			raw: true,
		});
		
		const extraData = await expandData(req);
		return res.send( {
			title: `Edit Meeti ${meeti.title}`,
			...extraData,
			groups,
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

editRouter.post("/:meetiId", async (req, res) => {
	try {
		const meetiId = req.params.meetiId;
		console.log(`[POST] /post/user/meeti/edit/${meetiId}`);
		
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
				messages: message,
				type: "error"
			}]);
			
			const extraData = await expandData(req);
			return res
				.status(404)
				.send({
					...extraData
				});
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
				// This also guarantees no tampering
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
		
		// Send message
		const message = "Meeti updated";
		console.log(color.set(message, "green"));
		req.flash("messages", [{
			messages: message,
			type: "success"
		}]);
		
		const extraData = await expandData(req);
		return res.send({
			...extraData,
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = editRouter;
