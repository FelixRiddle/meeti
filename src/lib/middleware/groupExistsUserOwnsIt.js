const expandData = require("../misc/expandData");
const color = require("ansi-color");

const { renderDataInternalErrorMessage } = require("../status/messages");

/**
 * Validate that a group exists and the user owns it
 * 
 * The group id comes from the params 'groupId'
 */
async function groupExistsUserOwnsIt(req, res, next) {
	try {
		const groupId = req.params.groupId;
		console.log(`Group id: `, groupId);
		
		const Groups = req.models.Groups;
		const group = await Groups.findOne({
			where: {
				id: groupId,
			},
		});
		
		// Group exists
		if(!group) {
			const message = "The group doesn't exists";
			console.log(color.set(message, "red"));
			
			req.flash('messages', [{
				message,
				type: "error",
			}]);
			
			return res
				.status(404)
				.redirect("/user/admin");
		}
		
		// Validate ownership
		if(!(req.user.id === group.userId)) {
			const message = "You're not the owner of this group";
			console.log(color.set(message, "red"));
			
			req.flash('messages', [{
				message,
				type: "error",
				baddie: true,
			}]);
			
			return res
				.status(403)
				.redirect("/user/admin");
		}
		
		// Set group in the request
		req.group = group;
		
		return next();
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.render("status", {
				...renderDataInternalErrorMessage,
			});
	}
}

module.exports = groupExistsUserOwnsIt;
