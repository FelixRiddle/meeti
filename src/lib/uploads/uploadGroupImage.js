const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			return cb(null, `${process.cwd()}/public/uploads/groups`);
		},
		filename: (req, file, cb) => {
			const extension = file.mimetype.split("/")[1];
			
			return cb(null, `${uuidv4()}.${extension}`);
		}
	})
})
	.single("image");

/**
 * Upload group image
 */
function uploadGroupImage(req, res, next) {
	upload(req, res, function (err) {
		if(err) {
			console.error(err);
		} else {
			return next();
		}
	});
}

module.exports = uploadGroupImage;
