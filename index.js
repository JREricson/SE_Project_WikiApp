const express = require("express"),
  env = require("dotenv").config(),
  expressSanitizer = require("express-sanitizer"),
  methodOverride = require("method-override"),
  path = require("path"),
  mongoose = require("mongoose"),
  session = require("express-session"),
  flash = require("connect-flash"),
  passport = require("passport");

const MongoStore = require("connect-mongo");
//const mongoDBStore = require("connect-mongodb-session")(session);

// Passport Config
require("./config/passport")(passport);

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

//to store session on mongoAtlas
console.log(mongoUrl);
console.log(process.env.SECRET);

//Express session
const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: mongoUrl,

    touchAfter: 24 * 60 * 60, // 1 day
  }),
  secret: "process.env.SECRET",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // one week
    maxAge: 1000 * 60 * 60 * 24 * 7, // one week
  },
};
app.use(session(sessionConfig));

// Connect flash
app.use(flash());

//method methodOverride
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  //flash
  res.locals.success_msg = req.flash("successMsg");
  res.locals.error_msg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  res.locals.error_List = req.flash("errorList");
  //path dir for ejs templates
  res.locals.appDir = path.dirname(require.main.filename);
  next();
});

///////////
//importing routers and seting routes

//mapLists
app.use("/lists", require("./routes/mapLists"));

//authorization (logins/registration/etc)
app.use("/", require("./routes/auth"));

//api
app.use("/api", require("./routes/api"));

app.use((req, res, next) => {
  // res.send("404");
  res.status(404).render("pages/404");
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, console.log(`server started on port ${PORT} `));
