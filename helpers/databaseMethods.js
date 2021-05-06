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
  } catch {
    contentOwner = "undefined";
    console.log("did not find");
  }

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

moduleObj.findNamesOfUerLists = (userId) => {
  let listOfNameObjs; // name: Id pair objs
};

module.exports = moduleObj;
