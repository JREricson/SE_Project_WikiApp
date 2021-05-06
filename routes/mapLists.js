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
  if (contentOwner) {
    userLists = await dbMethods.findNamesOfUerLists(req.params.listId);
  }

  //TODO -- fix this ugly line
  if (typeof contentOwner != "object" || typeof listObj != "object") {
    res.status(404).render("pages/404");
  } else {
    console.log("--liat -- \n" + listObj, contentOwner);
    res.render("pages/viewMap", { contentOwner, listObj });
  }

  console.log("content owner -->" + contentOwner);
  //NeedListItems
  //redirect if no user or list

  //will later need user that is logged in
});

module.exports = router;
