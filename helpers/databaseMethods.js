const User = require("../models/user"),
  List = require("../models/list");

moduleObj = {};

/**
 * tries to find a user in the database, ruturns null if none found
 * @param {*} userId
 */
moduleObj.findUserbyId = async (userId) => {
  let contentOwner;
  try {
    contentOwner = await User.findById(userId);
    console.log("found?: " + contentOwner);
  } catch {}

  return contentOwner;
};

moduleObj.findListbyId = async (listId) => {
  let contentOwner;
  try {
    theList = await List.findById(listId);
  } catch {
    theList = "undefined";
  }
  return theList;
};

moduleObj.findListbyId = async (listId) => {
  try {
    theList = await List.findById(listId);
  } catch {
    theList = "undefined";
  }
  return theList;
};

moduleObj.findNamesOfUserLists = async (listOfListIds) => {
  console.log("in find names of user lists");
  let listOfNameObjs = []; // name: Id pair objs
  // let user = await User.findById(userId);
  try {
    if (listOfListIds.length > 0) {
      console.log(listOfListIds);
      await Promise.all(
        listOfListIds.map(async (listId) => {
          console.log("printing lists");
          let listObj = await List.findById(listId);
          let listName = listObj.lst_name;
          // console.log("list obj ", listObj);
          console.log("list name ", listName);
          let newObj = {};
          newObj[listName] = listId;
          console.log(JSON.stringify(newObj));

          listOfNameObjs.push(newObj);
        })
      );
      return listOfNameObjs;
    } else {
      console.log("no items in list");
      return listOfNameObjs;
    }
  } catch {
    console.log("something went wrong");
    return [];
  }
};

module.exports = moduleObj;
