//dotenv required for .env file
require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;
const mongoDbConnStr = process.env.MONGODB_URI || "mongodb://localhost/budget";

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//#region Original code
// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });
//#endregion

mongoose.connect(mongoDbConnStr, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log("Connected to = " + mongoDbConnStr);
  console.log(`App running on port ${PORT}!`);
});