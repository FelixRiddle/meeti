const passport = require("passport");
const Models = require("../../models/Models");
const LocalStrategy = require("passport-local").Strategy;

const sequelizeModels = new Models();

passport.use(new LocalStrategy({
		usernameField: "email",
		passwordField: "password"
	},
	async(email, password, done) => {
		const User = sequelizeModels.User;
		
		// Find user
		const user = await User.findOne({
			where: {
				email,
				emailConfirmed: true,
			}
		});
		
		// Check if user exists
		if(!user) {
			console.log(`User doesn't exists or the account has not confirmed email`);
			
			// FIXME: The messages are not shown
			// I'll finish the course first and then see how to fix it
			const messages = [{
				message: "That user doesn't exists",
				error: true,
			}];
			
			return done(null, false, {
				messages
			});
		}
		
		// Compare passwords
		const result = user.validatePassword(password);
		if(!result) {
			console.log(`User didn't pass password validation`);
			
			const messages = [{
				message: "Incorrect password or email",
				error: true,
			}];
			
			return done(null, false, {
				messages
			});
		}
		
		console.log("User logged in.");
		
		return done(null, user);
	}
));

passport.serializeUser(function (user, cb) {
	return cb(null, user);
});

passport.deserializeUser(function (user, cb) {
	return cb(null, user);
});

module.exports = passport;
