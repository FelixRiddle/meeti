const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { MAX_IMAGE_SIZE } = require("./constants");

const upload = multer({
	limits: {
		fileSize: MAX_IMAGE_SIZE
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
		// Check if it's an image
		const isImage = file.mimetype.startsWith("image/");
		if(!isImage) {
            return cb(new multer.MulterError({
                code: "LIMIT_FILE_TYPE",
                message: "Only images are allowed."
            }));
        }
		
		// Check size
		if(file.size > MAX_IMAGE_SIZE) {
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
	return upload(req, res, function (err) {
		if(err) {
			console.error(err);
			if(err instanceof multer.MulterError) {
				if(err.code === "LIMIT_FILE_SIZE") {
					req.flash("error", "File size is too big");
				} else {
					req.flash("error", err.message);
				}
			} else if(err.hasOwnProperty("message")) {
				req.flash("error", err.message);
			}
			
			return res.redirect("back");
		} else {
			return next();
		}
	});
}

module.exports = uploadGroupImage;
