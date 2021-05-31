console.log("object");

document.getElementById("cancel-del-user-btn").addEventListener("click", () => {
  document.getElementById("delete-user-options").hidden = "true";
});
document.getElementById("delete-user-btn").addEventListener("click", () => {
  document.getElementById("delete-user-options").removeAttribute("hidden");
});

const confirmDeleteText = document.getElementById("confirm-delete-text");
document
  .getElementById("confirm-del-user-btn")
  .addEventListener("click", () => {
    if (confirmDeleteText.value != "delete") {
      console.log("try again");
      document.getElementById("enter-delete-warning").removeAttribute("hidden");
    } else {
      document.getElementById("delete-user-form").submit();
    }
  });
