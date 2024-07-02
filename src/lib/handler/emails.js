const nodemailer = require("nodemailer");
const fs = require("fs");
const util = require("util");
const ejs = require('ejs');

const transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	}
});

/**
 * Send email
 */
async function sendMail({
	user,
	filename,
	magicLink,
	subject,
}) {
	// Read file for the email
	const file = `${process.cwd()}/views/emails/${filename}.ejs`;
	
	// Compile
	const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));
	
	// Create html
	const html = compiled({
		magicLink,
	});
	
	const emailInfo = {
		from: "Meeti <noreply@meeti.com>",
		to: user.email,
		subject,
		html
	};
	
	// Send email
	const mail = util.promisify(transport.sendMail, transport);
	
	return mail.call(transport, emailInfo);
}

module.exports = sendMail;
