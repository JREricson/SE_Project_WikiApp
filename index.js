const express = require("express");
const env = require("dotenv").config();

const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const path = require("path");

//setting up app
///////////////////
const app = express();

//bodyParser
app.use(express.urlencoded({ extended: false }));
//stting public folder
app.use(express.static(path.join(__dirname, "public")));
//ejs
//sanitizing data
app.use(expressSanitizer());
//app.use(expressLayouts);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("test");
});

app.get("/login", (req, res) => {
  res.send("test");
});

app.get("/register", (req, res) => {
  res.send("test");
});

app.get("/about", (req, res) => {
  res.send("test");
});

//api
app.use("/api", require("./routes/api"));

app.use((req, res, next) => {
  res.send("404");
  // res.status(404).render("404");
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, console.log(`server started on port ${PORT} `));
