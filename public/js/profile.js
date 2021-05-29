fetch("/user-details")
  .then((resp) => resp.json())
  .then((response) => {
    document.getElementById(
      "namesetting"
    ).innerHTML = `<strong>${response.name}</strong>`;
    document.getElementById("profile-picture").src = response.avatarLink;
  });

//sidebar scrool position fix code
window.onscroll = function () {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
};

const navbar = document.getElementById("profiletop");
const sticky = navbar.offsetTop;

// Get the modal
const modal = document.getElementById("passwordchangemsgbox");

// Get the button that opens the modal
const btn = document.getElementById("changeprofile");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

const hideModal = () => (modal.style.display = "none");
// When the user clicks on <span> (x), close the modal
span.onclick = hideModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) hideModal();
};

const submitAvatar = (e) => {
  e.preventDefault();
  const updateAvatarForm = document.getElementById("update-avatar-form");
  console.log("form submitted");
  const formData = new FormData(updateAvatarForm);
  console.log(formData);

  const fetchOptions = {
    method: "POST",
    body: formData,
  };

  fetch("/update-avatar", fetchOptions);
};
