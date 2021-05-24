fetch = require("node-fetch");

const express = require("express");
const router = express.Router();

//local modules
const dbMethods = require("../helpers/databaseMethods"),
  authMiddle = require("../middle/authMiddle");

//mongo models
const User = require("../models/user");
const List = require("../models/list");

router.get("/:userId/:listId", async (req, res) => {
  //need userItems

  let { contentOwner, listObj, userLists } = await getListDetailsFromServices(
    req
  );

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
      GPSList,
      mapScript,
    });
  }

  //console.log("content owner -->" + contentOwner);
  //NeedListItems
  //redirect if no user or list

  //will later need user that is logged in
});
router.get(
  "/:userId/:listId/edit",
  // authMiddle.isCurUserContentOwner,
  async (req, res) => {
    let { contentOwner, listObj, userLists } = await getListDetailsFromServices(
      req
    );

    //TODO -- fix this ugly line
    if (typeof contentOwner != "object" || typeof listObj != "object") {
      res.status(404).render("pages/404");
    } else {
      // console.log("--liat -- \n" + listObj, contentOwner);
      console.log("rendering page");
      res.render("pages/editMap", {
        contentOwner,
        listObj,
        userLists,
        imgUrlList,
        textList,
        GPSList,
      });
    }
  }
);

module.exports = router;
async function getListDetailsFromServices(req) {
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
  // make sure will not crash if no url
  //use fetch to get image
  imgUrlList = {};
  textList = {};
  GPSList = {};
  mapScript = "";

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
        //text service --  Intro
        let textServiceRes = await fetch(
          `https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}`
        );

        let textJson = await textServiceRes.json();

        if (textJson["Intro"]) {
          // console.log(JSON.stringify(textJson.Intro));
          textList[ndx] = JSON.stringify(textJson.Intro);
        }

        //text service -- GPS
        let textGPSServiceRes = await fetch(
          `https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}/coords`
        );

        let GPSJson = await textGPSServiceRes.json();

        if (GPSJson) {
          //console.log(JSON.stringify(GPSJson));
          GPSList[ndx] = JSON.stringify(GPSJson);
        }
      })
    ).then(async () => {
      //mapping service

      if (Object.keys(GPSList).length > 0) {
        console.log("attempting to get map script");
        let mapServiceJsonPost = {
          key: process.env.MAP_KEY,
          id: "mapid",
        };

        await Promise.all(
          listObj.lst_items.map(async (item, ndx) => {
            console.log("at ndx ", item.itm_Name);
            let gpsParsed = JSON.parse(GPSList[ndx]); //GPSList[ndx]
            let lat = gpsParsed["lat"];
            let lon = gpsParsed["lon"];

            mapServiceJsonPost[ndx] = {
              title: `t${ndx}`, //item.itm_Name
              coordinates: {
                lat: Number(lat),
                lon: Number(lon),
              },
            };
          })
        );
        console.log("mapPost is ", mapServiceJsonPost);
        //TODO exctract func below
        const mapServiceRes = await fetch(
          "https://easy-map-maker.herokuapp.com",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mapServiceJsonPost),
          }
        );
        const mapServiceJson = await mapServiceRes.json();
        {
        }
        console.log(mapServiceJson);

        if (mapServiceJson && mapServiceJson.errors === "No errors.") {
          console.log("no errors getting map script");
          mapScript = mapServiceJson.script;
        }
      } else {
        console.log("ficks this");
      }
    });
  }
  return { contentOwner, listObj, userLists };
}
