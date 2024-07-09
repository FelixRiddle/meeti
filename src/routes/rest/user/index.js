const express = require("express");

const groupRouter = require("./group");
const authRouter = require("../auth");
const meetiRouter = require("./meeti");
const adminRouter = require("./admin");
const profileRouter = require("./profile");
const expandData = require("../../../lib/misc/expandData");

const userRouter = express.Router();

userRouter.use("/admin", adminRouter);
userRouter.use("/auth", authRouter);
userRouter.use("/group", groupRouter);
userRouter.use("/meeti", meetiRouter);
userRouter.use("/profile", profileRouter);

userRouter.get("/", async (req, res) => {
	const {
		User
	} = req.models;
	const user = await User.findByPk(req.user.id);
	return res.send({
		...expandData(req),
		user,
	});
})

module.exports = userRouter;
