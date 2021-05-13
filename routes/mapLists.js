fetch = require("node-fetch");

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
  let userLists;
  if (contentOwner) {
    userLists = await dbMethods.findNamesOfUserLists(contentOwner.usr_listIds);
    console.log("user lists are", userLists);
  }
  // make sure will not crahs f no url
  //use fetch to get image
  imgUrlList = {};
  textList = {};
  if (listObj && listObj.lst_items) {
    //sorting through each list item
    await Promise.all(
      listObj.lst_items.map(async (item, ndx) => {
        //finding url
        let urlParts = item.itm_url.split("/");
        let wikiPath = urlParts[urlParts.length - 1];
        console.log(wikiPath);

        /////image service below-- bring to func:
        let imgServiceRes = await fetch(
          `https://wiki-image-scraper.herokuapp.com/api/images/?title=${wikiPath}&ct=main`
        );

        let imgJson = await imgServiceRes.json();

        if (imgJson["images"]) {
          imgUrlList[ndx] = imgJson["images"];
          console.log("added to the list", imgUrlList);
          console.log(
            "the url for the img is \n===========================================================================================================================",
            imgJson["images"]
          );
        }
        /////image service above-- bring to func:

        //text service
        let textServiceRes = await fetch(
          `https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}`
        );

        let textJson = await textServiceRes.json();

        if (textJson["Intro"]) {
          console.log(JSON.stringify(textJson.Intro));
          textList[ndx] = JSON.stringify(textJson.Intro);
          // imgUrlList[ndx] = "https:" + imgJson["Intro"];
          // console.log("added to the list", imgUrlList);
          // console.log(
          //   "the url for the img is \n===========================================================================================================================",
          //   imgJson["images"]
          // );
        }
      })
    );
  }

  //add data to list obj

  //use fetch to get data
  //add data to list obj

  //TODO -- fix this ugly line
  if (typeof contentOwner != "object" || typeof listObj != "object") {
    res.status(404).render("pages/404");
  } else {
    // console.log("--liat -- \n" + listObj, contentOwner);
    console.log("rendering page");
    res.render("pages/viewMap", {
      contentOwner,
      listObj,
      userLists,
      imgUrlList,
      textList,
    });
  }

  //console.log("content owner -->" + contentOwner);
  //NeedListItems
  //redirect if no user or list

  //will later need user that is logged in
});

module.exports = router;
