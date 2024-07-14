const express = require("express");

const deleteRouter = express.Router();

deleteRouter.post("/:commentId", async (req, res, next) => {
	try {
		const {
			Comment
		} = req.models;
		const commentId = req.params.commentId;
		
		const comment = await Comment.findByPk(commentId);
		if(!comment) {
			req.flash('messages', [{
				message: "The comment doesn't exists",
				type: "error"
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
