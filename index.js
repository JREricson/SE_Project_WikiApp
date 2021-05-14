const express = require("express");
const env = require("dotenv").config();

const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
//const MongoDBStore = require("connect-mongo")(session);

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

///////////////////////////////////////////////
// const User = require("./models/user"),
//   List = require("./models/list");
// //Dropping old content
// ////////////////////
// //drop user model
// User.deleteMany({}, function (err) {
//   console.log("user colletion removed");
// });

// //drop list model
// List.deleteMany({}, function (err) {
//   console.log("list colletion removed");
// });

// //creating test user
// ///////////////////////
// let user = new User({
//   usr_name: "test_user",
//   usr_listIds: [],
//   usr_password: "badPw",
// });

// //Creating lists for test User
// ///////////////////

// //creating list of great lakes
// let list1 = new List({
//   lst_name: "Great Lakes",
//   lst_items: [
//     {
//       itm_Name: "Lake Huron",
//       itm_url: "https://en.wikipedia.org/wiki/Lake_Huron",
//     },
//     {
//       itm_Name: "Lake Superior",
//       itm_url: "https://en.wikipedia.org/wiki/Lake_Superior",
//     },
//     {
//       itm_Name: "Lake Michigan",
//       itm_url: "https://en.wikipedia.org/wiki/Lake_Michigan",
//     },
//     {
//       itm_Name: "Lake Erie",
//       itm_url: "https://en.wikipedia.org/wiki/Lake_Erie",
//     },
//     {
//       itm_Name: "Lake Ontario",
//       itm_url: "https://en.wikipedia.org/wiki/Lake_Ontario",
//     },
//   ],
// });
// list1.save();

// //creating list of large American Cities

// //creat list of desserts
// let list2 = new List({
//   lst_name: "Great LakesImportant Deserts",
//   lst_items: [
//     {
//       itm_Name: "Gobi Desert",
//       itm_url: "https://en.wikipedia.org/wiki/Gobi_Desert",
//     },
//     {
//       itm_Name: "Sahara",
//       itm_url: "https://en.wikipedia.org/wiki/Sahara",
//     },
//   ],
// });
// list2.save();

// console.log(list2._id);

// //user.lst_items.push()

// user.usr_listIds.push(list1._id);
// user.usr_listIds.push(list2._id);
// user.save();

const PORT = process.env.PORT || 3007;
app.listen(PORT, console.log(`server started on port ${PORT} `));
