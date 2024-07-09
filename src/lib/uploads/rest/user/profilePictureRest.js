const multer = require("multer");
const fs = require("fs");
const color = require('ansi-color');

const expandData = require("../../../misc/expandData");
const { MAX_IMAGE_SIZE } = require("../../constants");
const UserFolder = require("../../../public/user/UserFolder");

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
				// There's a tiny leak where images of different extensions will be preserved
				// Guard that there's only one pfp
				const sameFile = filename === user.pfp;
				if(!sameFile) {
					// Just in case check for its existence
					const pfpPath = userFolder.getPfp();
					if(fs.existsSync(pfpPath)) {
						// Delete previous pfp
						fs.rmSync();
					}
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
}).single("pfp");

/**
 * Upload group image
 */
function profilePictureRest(req, res, next) {
	return upload(req, res, async function (err) {
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
			
			req.flash("messages", [{
				message: "Profile picture updated",
				type: "success"
			}]);
			
			const extra = await expandData(req);
			return res
				.status(400)
				.send({
					...extra
				});
		} else {
			return next();
		}
	});
}

module.exports = profilePictureRest;
