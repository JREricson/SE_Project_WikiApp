fetch = require("node-fetch");

let pagelistData = document.getElementById("list-data");

let testDiv = document.getElementById("test-div");

let ListDataObj = JSON.parse(pagelistData.dataset.list);
console.log(ListDataObj);

const getImageFakeService = (url, item) => {
  //final provided service will only use last part of url
  let urlParts = url.split("/");
  let wikiPath = urlParts[urlParts.length - 1];
  console.log(wikiPath);
  let itemLink = "";

  fetch;

  // switch (wikiPath) {
  //   case "Lake_Huron":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/4/4f/Brucesky.jpg";
  //     break;
  //   case "Lake_Erie":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/1/12/Lake_Erie_Land%27s_End.jpg";
  //     break;
  //   case "Lake_Michigan":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/d/d0/Lake_Michigan_Landsat_Satellite_Photo.jpg";
  //     break;
  //   case "Lake_Ontario":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Lake_Ontario_shoreline%2C_Mississauga_%2829869953971%29.jpg/1024px-Lake_Ontario_shoreline%2C_Mississauga_%2829869953971%29.jpg";
  //     break;

  //   case "Lake_Superior":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Lake-Superior.svg/1024px-Lake-Superior.svg.png";
  //     break;
  //   ////
  //   case "Sahara":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Sahara_satellite_hires.jpg/1024px-Sahara_satellite_hires.jpg";
  //     break;
  //   case "Gobi_Desert":
  //     itemLink =
  //       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Gobi_Desert_dunes.jpg/800px-Gobi_Desert_dunes.jpg";
  //     break;
  //   default:
  // }

  item.imgUrl = itemLink;
};

ListDataObj.lst_items.forEach((item) => {
  testDiv.innerHTML += ` <p>${item.itm_Name}:<a href="${item.itm_url}">link</a></p>`;
  getImageFakeService(item.itm_url, item);
});

//changing items in modal based on click of buttons

//need the id realted to list item
//get details from storaged json
