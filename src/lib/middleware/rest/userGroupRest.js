const color = require("ansi-color");

const expandData = require("../../misc/expandData");
const { renderDataInternalErrorMessage } = require("../../status/messages");

/**
 * Validate that a group exists and the user owns it
 * 
 * The group id comes from the params 'groupId'
 * 
 * This is for the rest api
 */
async function userGroupRest(req, res, next) {
	try {
		const groupId = req.params.groupId;
		
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
				.send({
					...expandData(req)
				});
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
				.send({
					...expandData(req)
				});
		}
		
		// Set group in the request
		req.group = group;
		
		return next();
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.send({
				...renderDataInternalErrorMessage,
			});
	}
}

module.exports = userGroupRest;
