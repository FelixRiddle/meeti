const express = require("express");

const editRouter = require("./edit");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const expandData = require("../../../../lib/misc/expandData");

const profileRouter = express.Router();

profileRouter.use("/edit", editRouter);

profileRouter.get("/:userId", async (req, res) => {
	try {
		const extraData = await expandData(req, {
			useSession: false,
		});
		return res.send({
			...extraData
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage,
			});
	}
});

module.exports = profileRouter;
