const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

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

      itm_url: {
        type: String,
        default: "",
      },
    },
  ],
});

const List = mongoose.model("List", ListSchema);
module.exports = List;
