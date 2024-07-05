const { body } = require("express-validator");
const { DESCRIPTION_LENGTH, STRING_LENGTH, LONG_STRING_LENGTH } = require("./constants");

const CREATE_MEETI_VALIDATION = [
	// Title
	body("title", "Title can't be empty").escape().notEmpty(),
	body("title", "Title must be shorter than 256 characters")
		.isLength({ max: STRING_LENGTH }),
	// Description
	body("description", "Description can't be empty")
		// Should try to escape bad html tags
		.notEmpty(),
	body("description", "Description must be shorter than 8192 characters")
		.isLength({ max: DESCRIPTION_LENGTH }),
	// Featuring
	body("featuring", "Featuring too long")
		.escape()
		.isLength({ max: STRING_LENGTH }),
	// Coupon
	body("coupon", "Coupon is incorrect")
		.escape()
		.isNumeric(),
	// Date
	body("date", "Date is incorrect")
		.escape()
		.isDate(),
	// Time
	body("time")
		.escape()
		.isTime(),
	// Street
	body("street", "Street is required")
		.escape()
		.notEmpty(),
	body("street", "Street is too long")
		.isLength({ max: LONG_STRING_LENGTH }),
	// City
	body("city", "City is required")
		.escape()
		.notEmpty(),
	body("city", "City is too long")
		.isLength({ max: LONG_STRING_LENGTH }),
	// State
	body("state", "State is required")
		.escape()
		.notEmpty(),
	body("state", "State is too long")
		.isLength({ max: LONG_STRING_LENGTH }),
	// Country
	body("country", "Country is required")
		.escape()
		.notEmpty(),
	body("country", "Country is too long")
		.isLength({ max: LONG_STRING_LENGTH }),
	// Latitude
	body("latitude", "Latitude is required")
		.escape()
		.notEmpty(),
	body("latitude", "Latitude must be a number")
		.isNumeric(),
	// Longitude
	body("longitude", "Longitude is required")
		.escape()
		.notEmpty(),
	body("longitude", "Longitude must be a number")
		.isNumeric(),
];

module.exports = CREATE_MEETI_VALIDATION;
