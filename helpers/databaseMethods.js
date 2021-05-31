const User = require("../models/user"),
  List = require("../models/list"),
  bcrypt = require("bcryptjs");
moduleObj = {};

///////////////
//create methods
///////////////

/**
 *Creates a new user based on params with encrypted pw password
 * @param {*} name
 * @param {*} password
 * @param {*} email
 */
moduleObj.createUser = async (userName, password) => {
  let newUser = new User({
    usr_name: userName,
    usr_password: password,
  });
  console.log("new user is: ", newUser);
  //encrypting password
  encryptPasswordAndSaveUser(newUser);
  console.log("enc user is: ", newUser);
  return newUser;
};

/////////////
//read methods
//////////////

/**
 * tries to find a user in the database, returns null if none found
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
  let listOfNameObjs = [];

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

/////////////////
//Delete methods
/////////////////

/**
 * Deletes user with userID from database
 * @param {string} userID
 */
moduleObj.deleteUser = (userID) => {
  User.findByIdAndRemove(userID, function (err) {
    if (err) {
      console.log("error removing user \n" + err);
    }
  });
};

moduleObj.deleteList = async (listId) => {
  await List.findByIdAndRemove(listId, function (err) {
    if (err) {
      console.log("error removing list \n" + err);
    }
  });
};

moduleObj.deleteListWithReferences = async (listId, userId) => {
  await User.findByIdAndUpdate(userId, {
    $pull: { usr_listIds: listId },
  });

  await moduleObj.deleteList(listId);
};

moduleObj.deleteAllListInArray = async (arrayOfListIds) => {
  await List.deleteMany({ _id: arrayOfListIds });
};

/////////////////
//helper functions
/////////////////

/**
 * Changes password to encrypted password and saves user to database
 * @param {*} newUser
 */
const encryptPasswordAndSaveUser = (newUser) => {
  console.log("new user is: ", newUser);
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.usr_password, salt, (err, hash) => {
      ///   if (err) throw err;
      newUser.usr_password = hash;
      newUser.save().catch((err) => console.log(err));
    });
  });
};

///////////////////////////

module.exports = moduleObj;
