const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  textSearch = require("mongoose-text-search");

const ListSchema = new Schema({
  li_name: {
    type: String,
    required: true,
  },
  li_items: [
    {
      it_Name: {
        type: String,
        default: "",
      },
      // longitude: {
      //   type: String,
      //   default: "",
      // },
      // latitude: {
      //   type: String,
      //   default: "",
      it_Desc: {
        type: String,
        default: "",
      },
    },
  ],
});

//adding index for searching names
UserSchema.plugin(textSearch);
UserSchema.index({ name: "text" });

const User = mongoose.model("User", UserSchema);
module.exports = User;
