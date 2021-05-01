const express = require("express");
const env = require("dotenv").config();

const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const path = require("path");

//Setting up database -- using MongoAtlas
//url for database
const mongoUrl = process.env.MONGO_URL;

//connecting to mongo
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
//mongoose.set('useCreateIndex', true);
//handle a depreciation warning on useFindAndModify
mongoose.set("useFindAndModify", false);

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

app.get("/lists/:userID/:ListId", (req, res) => {
  res.render("pages/viewMap");
});

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
  res.render("pages/about");
});

//api
app.use("/api", require("./routes/api"));

app.use((req, res, next) => {
  // res.send("404");
  res.status(404).render("pages/404");
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, console.log(`server started on port ${PORT} `));
