const { body } = require("express-validator");

const STRING_LENGTH = 256;
const CREATE_GROUP_VALIDATION = [
	body("name", "The name can't be empty").escape().notEmpty(),
	body("name", "Name must be shorter than 256 characters").isLength({ max: STRING_LENGTH }),
	body("description", "Description can't be empty").escape().notEmpty(),
	body("description", "Description must be shorter than 8192 characters").isLength({ max: 8192 }),
	body("category", "Category can't be empty").escape().notEmpty(),
	body("url", "Bad url").escape(),
	body("url", "Url can't be longer than 1024 characters").isLength({ max: 1024 }),
];

module.exports = CREATE_GROUP_VALIDATION;
