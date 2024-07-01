const express = require("express");
const dotenv = require("dotenv");

dotenv.config({
	path: ".env"
});

// All impotyd should be after dotenv initialization
// So that they can read environment variables
const { PORT } = require("./lib/config/env");
const mainRouter = require("./routes");

const app = express();

// Enable EJS
app.set("view engine", "ejs");
app.set(`views`, `${process.cwd()}/views`);

app.use("/public", express.static("public"));

app.use(mainRouter);

app.listen(PORT, () => {
	console.log(`Server listening at http://localhost:${PORT}`);
});
