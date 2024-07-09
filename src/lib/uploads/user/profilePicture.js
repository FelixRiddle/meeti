const multer = require("multer");
const fs = require("fs");

const { MAX_IMAGE_SIZE } = require("../constants");
const UserFolder = require("../../public/user/UserFolder");

const upload = multer({
	limits: {
		fileSize: MAX_IMAGE_SIZE
	},
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const userFolder = new UserFolder(req.user);
			return cb(null, userFolder.get());
		},
		filename: async (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			const filename = `pfp.${extension}`;
			
			const {
				User
			} = req.models;
			
			// User information
			const user = await User.findByPk(req.user.id);
			const userFolder = new UserFolder(user);
			
			// If pfp exists
			if(user.pfp) {
				console.log(`User has pfp`);
				// There's a tiny leak where images of different extensions will be preserved
				// Guard that there's only one pfp
				const sameFile = filename === user.pfp;
				if(!sameFile) {
					console.log(`Pfp has different extension, deleting previous`);
					
					// Delete previous pfp
					fs.rmSync(userFolder.getPfp());
				}
			}
			
			return cb(null, filename);
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
	.single("pfp");

/**
 * Upload group image
 */
function profilePicture(req, res, next) {
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

module.exports = profilePicture;
