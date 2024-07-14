const express = require("express");

const deleteRouter = express.Router();

deleteRouter.post("/:commentId", async (req, res, next) => {
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
			res.redirect("back");
			
			return next();
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
			res.redirect("back");
			
			return next();
		}
		
		await comment.destroy();
		
		return res.redirect('back');
	} catch(err) {
		console.error(err);
		return res.redirect("/500");
	}
});

module.exports = deleteRouter;
