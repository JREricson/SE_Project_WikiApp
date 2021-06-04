//dependency modules
const fetch = require("node-fetch"),
  express = require("express"),
  router = express.Router();

//local modules
const dbMethods = require("../helpers/databaseMethods"),
  authMiddle = require("../middle/authMiddle");

//mongo models
const User = require("../models/user");
const List = require("../models/list");
const { Promise } = require("mongoose");

router.get("/:userId/:listId", async (req, res) => {
  //need userItems

  let { contentOwner, listObj, userLists } = await getListDetailsFromServices(
    req
  );

  //TODO -- fix this ugly line!!!!
  if (typeof contentOwner != "object" || typeof listObj != "object") {
    res.status(404).render("pages/404");
  } else {
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
});

router.put(
  "/:userId/:listId/edit",
  authMiddle.isLoggedIn,
  authMiddle.isCurUserContentOwner,
  async (req, res) => {
    console.log("post attempted");
    let {
      deleteListItemsChecked,
      newListItemsChecked,
      listNames,
      wikiUrls,
      listTitle,
    } = req.body;
    //some debug messages that will be removed in short order
    console.log("n: ", newListItemsChecked);
    console.log("l: ", listNames);
    console.log("u: ", wikiUrls);
    console.log("t: ", listTitle);
    console.log("d: ", deleteListItemsChecked);

    let errors = [];
    let textJson, GPSJson;
    console.log("type is", typeof newListItemsChecked);
    //reassignment to array because, because checkBox item
    //is coerced to an string if singular or an array if not
    if (typeof newListItemsChecked === "string") {
      newListItemsChecked = [newListItemsChecked];
    }
    //get errors or update
    try {
      ({ textJson, GPSJson } = await generateErrorsAndAddNewListItems(
        newListItemsChecked,
        listNames,
        wikiUrls,
        textJson,
        errors,
        GPSJson,
        req
      ));
    } catch {
      console.log("failed at getting items");
    }

    //update title if needed
    await updateTitle(req, listTitle);

    //removing items
    //reassignment to array because, because checkBox item is coerced to an
    // string if singular or an array if not
    if (typeof deleteListItemsChecked === "string") {
      deleteListItemsChecked = [deleteListItemsChecked];
    }
    await deleteItemsFromList(deleteListItemsChecked, req.params.listId);

    console.log("errs " + JSON.stringify(errors));

    if (errors.length > 0) {
      req.flash("errorList", errors);
    }
    res.redirect(`/lists/${req.params.userId}/${req.params.listId}/edit`);
  }
);

//edit page for a list item
router.get(
  "/:userId/:listId/edit",
  authMiddle.isLoggedIn,
  authMiddle.isCurUserContentOwner,
  async (req, res) => {
    let { contentOwner, listObj, userLists } = await getListDetailsFromServices(
      req
    );

    //TODO -- fix this ugly line
    if (typeof contentOwner != "object" || typeof listObj != "object") {
      res.status(404).render("pages/404");
    } else {
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

//handle delete request of item
router.get(
  "/:userId/:listId/delete",
  // authMiddle.isLoggedIn,
  // authMiddle.isCurUserContentOwner,
  async (req, res) => {
    //delete list
    await dbMethods.deleteListWithReferences(
      req.params.listId,
      req.params.userId
    );

    res.redirect("/lists/new");
  }
);

//route for new list item
router.get("/new", authMiddle.isLoggedIn, async (req, res) => {
  let userLists = await dbMethods.attemptFindNamesOfUserListItems(
    req.user.usr_listIds
  );
  let authUser = req.user;
  res.render(`pages/newListPage`, { authUser, userLists });
});

//handling new List item
router.post("/new", authMiddle.isLoggedIn, async (req, res) => {
  console.log("in post req for new list");

  //get values from req
  let { listName } = req.body;

  //create new list
  let newList = new List({
    lst_name: listName,
  });
  await newList.save();
  console.log(newList._id);

  let newListId = newList._id;

  //update user
  let contentOwner = req.user;
  console.log(contentOwner);
  contentOwner.usr_listIds.push(newListId);
  contentOwner.save();

  //redirect to new list
  res.redirect(`${contentOwner._id}/${newListId}/edit`);
});

module.exports = router;

/**
 * Yikes! that is an ugly long function!!
 * @param {*} textJson
 * @param {*} errors
 * @param {*} GPSJson
 * @param {*} req
 * @returns
 */
async function generateErrorsAndAddNewListItems(
  newListItemsChecked,
  listNames,
  wikiUrls,
  textJson,
  errors,
  GPSJson,
  req
) {
  await Promise.all(
    newListItemsChecked.map(async (item) => {
      console.log("n: ", newListItemsChecked);
      if (listNames[item] !== "" && wikiUrls[item] !== "") {
        let urlPass = false;
        let gpsPass = false;
        //getting end of url from provided url
        let urlParts = wikiUrls[item].split("/");
        let wikiPath = urlParts[urlParts.length - 1];
        try {
          textJson = await getTextJsonFromService(wikiPath);
          urlPass = true;
        } catch {
          errors.push("could not process url " + wikiUrls[item]);
        }
        console.log("========================================================");
        try {
          GPSJson = await getGPSJson(wikiPath);
          if (GPSJson["Error"]) {
            errors.push("no GPS coordinates for url " + wikiUrls[item]);
          } else {
            gpsPass = true;
          }
        } catch {
          errors.push("could get GPS coordinates for url " + wikiUrls[item]);
        }
        if (gpsPass && urlPass) {
          console.log(
            `adding "${listNames[item]}" to db\n---------------------`
          );
          //TODO -- add verification of ownership
          await List.findByIdAndUpdate(req.params.listId, {
            $push: {
              lst_items: {
                itm_Name: listNames[item],
                itm_url: wikiUrls[item],
              },
            },
          });
        } else {
          console.log(
            "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
          );
        }
        console.log(JSON.stringify(GPSJson));
      }
    })
  );
  return { textJson, GPSJson };
}
/**
 * The List in the database by the req object, then updates the value of
 * the list's title
 * @param {*} req
 * @param {string} listTitle
 */
async function updateTitle(req, listTitle) {
  let list = await List.findById(req.params.listId);

  if (list && list.lst_name) {
    if (list.lst_name !== listTitle) {
      await List.findByIdAndUpdate(
        req.params.listId,
        { lst_name: listTitle },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}

/**
 * Fret Not fellow compatriots! This will be broken down to look all purdy purdy
 * @param {*} req
 * @returns
 */
const getListDetailsFromServices = async (req) => {
  let contentOwner = await dbMethods.findUserbyId(req.params.userId);

  let listObj;
  if (contentOwner) {
    listObj = await dbMethods.findListbyId(req.params.listId);
  }
  let userLists;
  if (contentOwner) {
    userLists = await dbMethods.attemptFindNamesOfUserListItems(
      contentOwner.usr_listIds
    );
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
        try {
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
        } catch {
          //TODO handle this
        }
        /////image service above-- bring to func:
        //text service --  Intro
        try {
          let textJson = await getTextJsonFromService(wikiPath);

          if (textJson["Intro"]) {
            textList[ndx] = JSON.stringify(textJson.Intro);
          }
        } catch {
          //TODO handle this
        }
        try {
          //text service -- GPS
          let GPSJson = await getGPSJson(wikiPath);

          if (GPSJson) {
            //console.log(JSON.stringify(GPSJson));
            GPSList[ndx] = JSON.stringify(GPSJson);
          }
        } catch {
          //TODO handle this
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
            if (GPSList[ndx]) {
              let gpsParsed = JSON.parse(GPSList[ndx]); //GPSList[ndx]
              let lat = gpsParsed["lat"];
              let lon = gpsParsed["lon"];
              console.log(gpsParsed);
              let titleStr = item.itm_Name;
              titleStr = titleStr.replace(" ", "_");
              mapServiceJsonPost[ndx] = {
                title: `${titleStr}`, //item.itm_Name
                coordinates: {
                  lat: Number(lat),
                  lon: Number(lon),
                },
              };
            }
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
};

/**
 * gets GPS containing JSON from service at
 * https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}/coords
 * @param {string} wikiPath
 * @returns {JSON} response from service
 */
async function getGPSJson(wikiPath) {
  let textGPSServiceRes = await fetch(
    `https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}/coords`
  );

  let GPSJson = await textGPSServiceRes.json();
  return GPSJson;
}

/**
 * gets JSON from service at https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}
 * @param {string} wikiPath
 * @returns {JSON} from service response
 */
async function getTextJsonFromService(wikiPath) {
  let textServiceRes = await fetch(
    `https://wiki-text-scraper.herokuapp.com/wiki/${wikiPath}`
  );

  let textJson = await textServiceRes.json();
  return textJson;
}

/**
 *
 * @param {[string]}  items - names of items to delete
 * @param {String} listId - Id of the List
 */
const deleteItemsFromList = async (items, listId) => {
  try {
    List.updateOne(
      { _id: listId },
      {
        $pull: {
          lst_items: { itm_Name: { $in: items } },
        },
      },
      { multi: true },
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch {
    console.log("err removing items");
  }
};
