const express = require("express");

const expandData = require("../../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../../../../lib/status/messages");

const commentRouter = express.Router();

commentRouter.post("/:meetiId", async (req, res, next) => {
	try {
		const {
			Comment
		} = req.models;
		
		const { comment } = req.body;
		await Comment.create({
			message: comment,
			userId: req.user.id,
			meetiId: req.params.meetiId,
		});
		
		req.flash("messages", [{
			message: "Comment created",
			type: "success"
		}]);
		const extra = await expandData(req);
		return res.send({
			...extra,
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = commentRouter;
