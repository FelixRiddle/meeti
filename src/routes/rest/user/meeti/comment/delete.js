const express = require("express");

const { renderDataInternalErrorMessage } = require("../../../../../lib/status/messages");
const expandData = require("../../../../../lib/misc/expandData");

const deleteRouter = express.Router();

deleteRouter.delete("/:commentId", async (req, res, next) => {
	try {
		const {
			Comment
		} = req.models;
		const commentId = req.params.commentId;
		
		// Get comment
		const comment = await Comment.findByPk(commentId);
		if(!comment) {
			req.flash('messages', [{
				message: "The comment doesn't exists",
				type: "error"
			}]);
			
			const extra = await expandData(req);
			return res.send({
				...extra
			});
		}
		
		// TODO: The same user could delete its own commets of other meetis whilst not seeing them.
		// A session that tracks what the user is seeing could prevent this kind of 'bot' behavior.
		// This is an extra feature.
		// TODO: The same could be applied to creation.
		
		// Check if the user owns it
		const userOwnsComment = req.user.id === comment.userId;
		if(!userOwnsComment) {
			req.flash('messages', [{
				message: "You are not the owner of this comment",
				type: "error",
				// This is endpoint tampering
				tampering: true,
			}]);
			
			const extra = await expandData(req);
			return res.send({
				...extra
			});
		}
		
		await comment.destroy();
		
		req.flash('messages', [{
			message: "Comment deleted",
			type: "success"
		}]);
		const extra = await expandData(req);
		return res.send({
			...extra
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = deleteRouter;
