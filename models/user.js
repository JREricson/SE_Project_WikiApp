const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  usr_name: {
    type: String,
    required: true,
  },
  usr_listIds: {
    //stores Lists objects
    type: [ObjectId],
    index: true,
    default: [],
    required: true,
  },
  usr_password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
