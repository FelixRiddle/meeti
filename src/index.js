const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
	path: ".env"
});

// All impotyd should be after dotenv initialization
// So that they can read environment variables
const { PORT } = require("./lib/config/env");

const app = express();

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
