const express = require("express");
const groupExistsUserOwnsIt = require("../../../../lib/middleware/groupExistsUserOwnsIt");

const deleteRouter = express.Router();

deleteRouter.delete("/:groupId", groupExistsUserOwnsIt, async(req, res) => {
	
});

module.exports = deleteRouter;
