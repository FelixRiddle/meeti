const express = require("express");
const color = require('ansi-color');

const logoutRouter = express.Router();

logoutRouter.get("/", (req, res) => {
	return req.logout(function(err) {
		if (err) {
			const message = "Couldn't log out";
			console.log(color.set(message, "red"));
			req.flash("messages", 
				[{
					message: message,
					type: "error"
				}]
			);
			
			return next(err);
		}
		
		const message = "Log out successful";
		console.log(color.set(message, "green"));
		req.flash("messages", 
			[{
				message: message,
				type: "success"
			}]
		);
		
		return res.redirect('/');
	});
});

module.exports = logoutRouter;
