//hide delete options
document.getElementById("cancel-delete-btn").addEventListener("click", () => {
  document.getElementById("delete-list-options").hidden = "true";
});
//show delete options
document.getElementById("show-delete-opt").addEventListener("click", () => {
  console.log("object");
  document.getElementById("delete-list-options").removeAttribute("hidden");
});
