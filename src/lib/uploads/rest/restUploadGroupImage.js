const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const color = require("ansi-color");

const maxFileSize = 1024 * 1024 * 5;

const upload = multer({
	limits: {
		fileSize: maxFileSize
	},
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			return cb(null, `${process.cwd()}/public/uploads/groups`);
		},
		filename: (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			
			return cb(null, `${uuidv4()}.${extension}`);
		},
	}),
	fileFilter: (req, file, cb) => {
		// Check size
		if(file.size > maxFileSize) {
			return cb(null, false);
		}
		
		// Check if it's an image
		const mimetype = file.mimetype;
		const isImage = mimetype.startsWith("image/");
		if(!isImage) {
			const message = "Only images are allowed.";
			console.log(color.set(message, "red"));
			return cb(new multer.MulterError({
				code: "LIMIT_FILE_TYPE",
				message,
			}));
		}
		
		return cb(null, true);
	}
})
	.single("image");

/**
 * Upload group image
 */
function restUploadGroupImage(req, res, next) {
	upload(req, res, function (err) {
		if(err) {
			console.error(err);
			if(err instanceof multer.MulterError) {
				if(err.code === "LIMIT_FILE_SIZE") {
					const message = "File size is too big";
					console.log(color.set(message, "red"));
					req.flash("error", message);
				} else {
					const message = err.message;
					console.log(color.set(message, "red"));
					req.flash("error", message);
				}
			} else if(err.hasOwnProperty("message")) {
				const message = err.message;
				console.log(color.set(message, "red"));
				req.flash("error", message);
			}
			
			return res.redirect("back");
		} else {
			return next();
		}
	});
}

module.exports = restUploadGroupImage;
