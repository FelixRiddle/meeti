const express = require("express");
const expandData = require("../../../../lib/misc/expandData");

const logoutRouter = express.Router();

logoutRouter.get("/", (req, res) => {
	
	const message = "Logged out";
	console.log(color.set(message, "green"));
	req.flash("messages", 
		[{
			message: message,
			type: "success"
		}]
	);
	
	return res
		.clearCookie("token")
		.send({
			...expandData(req)
		});
})

module.exports = logoutRouter;
