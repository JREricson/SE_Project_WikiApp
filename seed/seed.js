const User = require("../models/user"),
  List = require("../models/list"),
  mongoose = require("mongoose");
const env = require("dotenv").config();
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

//Dropping old content
////////////////////
//drop user model
User.deleteMany({}, function (err) {
  console.log("user colletion removed");
});

//drop list model
List.deleteMany({}, function (err) {
  console.log("list colletion removed");
});

//creating test user
///////////////////////
let user = new User({
  usr_name: "test_user",
  usr_listIds: [],
  usr_password: "badPw",
});

//Creating lists for test User
///////////////////

//creating list of great lakes
let list1 = new List({
  lst_name: "Great Lakes",
  lst_items: [
    {
      itm_Name: "Lake Huron",
      itm_url: "https://en.wikipedia.org/wiki/Lake_Huron",
    },
    {
      itm_Name: "Lake Superior",
      itm_url: "https://en.wikipedia.org/wiki/Lake_Superior",
    },
    {
      itm_Name: "Lake Michigan",
      itm_url: "https://en.wikipedia.org/wiki/Lake_Michigan",
    },
    {
      itm_Name: "Lake Erie",
      itm_url: "https://en.wikipedia.org/wiki/Lake_Erie",
    },
    {
      itm_Name: "Lake Ontario",
      itm_url: "https://en.wikipedia.org/wiki/Lake_Ontario",
    },
  ],
});
list1.save();

//creating list of large American Cities

//creat list of desserts
let list2 = new List({
  lst_name: "Great LakesImportant Deserts",
  lst_items: [
    {
      itm_Name: "Gobi Desert",
      itm_url: "https://en.wikipedia.org/wiki/Gobi_Desert",
    },
    {
      itm_Name: "Sahara",
      itm_url: "https://en.wikipedia.org/wiki/Sahara",
    },
  ],
});
list2.save();

console.log(list2._id);

//user.lst_items.push()

user.usr_listIds.push(list1._id);
user.usr_listIds.push(list2._id);
user.save();
//mongoose.disconnect();
