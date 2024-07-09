const express = require("express");
const expandData = require("../../../../lib/misc/expandData");

const logoutRouter = express.Router();

logoutRouter.get("/", async (req, res) => {
	
	const message = "Logged out";
	console.log(color.set(message, "green"));
	req.flash("messages", 
		[{
			message: message,
			type: "success"
		}]
	);
	
	const extraData = await expandData(req);
	return res
		.clearCookie("token")
		.send({
			...extraData
		});
})

module.exports = logoutRouter;
