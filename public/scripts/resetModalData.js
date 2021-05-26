//for btn in list -- add click listener

const modalBtns = document.querySelectorAll(".viewInfoBtn"),
  modalImg = document.getElementById("modal-image"),
  modalName = document.getElementById("modal-list-name"),
  modalDescription = document.getElementById("modal-list-description");

//getting images from data in html
let htmlData = document.getElementById("list-data");
let allImgUrls = JSON.parse(htmlData.dataset.imgurls);

//getting text from data in html
let allIntoText = JSON.parse(htmlData.dataset.text);
//getting other data
let theListData = JSON.parse(htmlData.dataset.list);

const open_modal = (index) => {
  //console.log(ListDataObj.lst_items[index]);
  let imgUrl = allImgUrls[index];
  console.log(imgUrl);

  let encodedUrl = encodeURIComponent(imgUrl);
  console.log(encodedUrl);
  modalImg.src = `https://create-a-map.herokuapp.com/api/picture?wid=${
    vw / 3
  }&fit=crop&url=${encodedUrl}`;
  modalName.innerHTML = theListData.lst_items[index].itm_Name;

  modalDescription.innerHTML = allIntoText[index];
};
