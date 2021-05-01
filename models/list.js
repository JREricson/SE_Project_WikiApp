const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

const ListSchema = new Schema({
  lst_name: {
    type: String,
    required: true,
  },
  lst_items: [
    {
      itm_Name: {
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
      itm_url: {
        type: String,
        default: "",
      },
    },
  ],
});

const List = mongoose.model("List", ListSchema);
module.exports = List;
