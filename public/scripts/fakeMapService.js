let mapItem = document.getElementById("map-item");
let listData = document.getElementById("list-data");
let listDataObj = JSON.parse(listData.dataset.list);
console.log(listDataObj.lst_name);
switch (listDataObj.lst_name) {
  case "Great Lakes":
    mapItem.src = "../../imgs/greatlakesPinned.png";
    break;
  case "Important Deserts":
    mapItem.src = "../../imgs/desertsPinned.png";
    break;
  default:
}
