const express = require("express");
const router = express.Router();

//local modules
const dbMethods = require("../helpers/databaseMethods");

//mongo models
const User = require("../models/user");
const List = require("../models/list");

router.get("/:userId/:listId", async (req, res) => {
  //need userItems
  let contentOwner = await dbMethods.findUserbyId(req.params.userId);

  let listObj;
  if (contentOwner) {
    listObj = await dbMethods.findListbyId(req.params.listId);
  }

  if (contentOwner && listObj) {
    res.render("pages/viewMap");
  } else {
    res.status(404).render("pages/404", { contentOwner, listObj });
  }

  console.log("content owner -->" + contentOwner);
  //NeedListItems
  //redirect if no user or list

  //will later need user that is logged in
});

module.exports = router;
