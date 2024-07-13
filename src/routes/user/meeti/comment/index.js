const express = require("express");

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
		
		return res.redirect("back");
	} catch(err) {
		console.error(err);
		
		return res.redirect("/500")
	}
});

module.exports = commentRouter;
