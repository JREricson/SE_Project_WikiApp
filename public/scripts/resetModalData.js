//for btn in list -- add click listener

const modalBtns = document.querySelectorAll(".viewInfoBtn"),
  modalImg = document.getElementById("modal-image"),
  modalName = document.getElementById("modal-list-name"),
  modalDescription = document.getElementById("modal-list-description");

//getting images from data in html
let imgUrlsElement = document.getElementById("list-data");
let allImgUrls = JSON.parse(imgUrlsElement.dataset.imgurls);

// for (const btn of modalBtns) {
//   btn.addEventListener("click", function (event) {
//     // modalImg.src = encodeURIComponent(
//     //   "https://cdn.shopify.com/s/files/1/0092/4424/6052/products/green-yerba-mate-circle-z_1024x1024@2x.jpg?v=1618864038"
//     // );
//     console.log("this is \n:" + JSON.stringify(this));
//     console.log(ListDataObj.list[this.data.index]);
//     // modalImg.src =
//     console.log("click");
//     //...
//   });
// }
const open_modal = (index) => {
  //console.log(ListDataObj.lst_items[index]);
  let imgUrl = allImgUrls[index];
  console.log(imgUrl);

  let encodedUrl = encodeURIComponent(imgUrl);
  console.log(encodedUrl);
  modalImg.src = `../../api/picture?wid=${vw / 3}&fit=crop&url=${encodedUrl}`;
  //modalName.innerHTML = // ListDataObj.lst_items[index].itm_Name;
  // ListDataObj.lst_items[index];
  //modalDescription.innerHTML = ListDataObj.lst_items[index].desc;
  // console.log(ListDataObj.lst_items[index]);
};
