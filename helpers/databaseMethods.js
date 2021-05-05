const User = require("../models/user"),
  List = require("../models/list");

moduleObj = {};

/**
 * tries to find a user in the database, ruturns null if none found
 * @param {*} userID
 */
moduleObj.findUserbyId = async (userID) => {
  let contentOwner;
  try {
    contentOwner = await User.findById(req.params.userId);
  } catch {
    contentOwner = "undefined";
  }

  return contentOwner;
};

moduleObj.findListbyId = async (userID) => {
  let contentOwner;
  try {
    theList = await List.findById(req.params.userId);
  } catch {
    theList = "undefined";
  }
  return theList;
};

module.exports = moduleObj;
