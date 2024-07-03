const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

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
		
		return cb(null, true);
	}
})
	.single("image");

/**
 * Upload group image
 */
function uploadGroupImage(req, res, next) {
	upload(req, res, function (err) {
		if(err) {
			console.error(err);
			if(err instanceof multer.MulterError) {
				if(err.code === "LIMIT_FILE_SIZE") {
					req.flash("error", "File size is too big");
				} else {
					req.flash("error", err.message)
				}
			}
			
			return res.redirect("back");
		} else {
			return next();
		}
	});
}

module.exports = uploadGroupImage;
