const dropdown = document.getElementsByClassName("dropdown")[0];
document.getElementsByClassName("fa-bell")[0].addEventListener("click", () => {
  if (dropdown.style.display == "block") dropdown.style.display = "none";
  else dropdown.style.display = "block";
});

// for navBar active effect
icons = document.querySelector(".icons").querySelectorAll("i");

icons.forEach((element) => {
  element.addEventListener("click", function () {
    icons.forEach((icons) => icons.classList.remove("active"));

    this.classList.add("active");
  });
});
