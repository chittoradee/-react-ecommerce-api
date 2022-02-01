const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

const Router = require("./routes/v1/routes");
app.use(Router);

app.listen(PORT, async () => {
	console.log("Server established at PORT : " + PORT);

	mongoose
		.connect(process.env.MONGO_DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("Database connection successfull");
		})
		.catch((err) => {
			console.log("error: ", err);
		});

	mongoose.connection.on("connected", () => {
		open = true;
		console.log("Database is Connected.");
	});

	mongoose.connection.on("error", (err) => {
		console.log("Coudln't connect to database. Error: ", err);
	});

	mongoose.connection.on("disconnected", () => {
		open = false;
		console.log("Database has been disconnected.");
	});
});
