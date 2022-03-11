var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
});

class email {
	sendmail(to, subject, text) {
		var mailOptions = {
			from: process.env.MAIL_FROM,
			to: to,
			subject: subject,
			text: text,
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				return error;
			} else {
				return "Email Sent!!";
			}
		});
	}
}
module.exports = email;
