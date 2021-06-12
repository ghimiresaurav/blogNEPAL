// fetch("/dashboard", {
//   method: "GET",
//   headers: {
//     "Content-type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data));

document.getElementById("user-avatar").src = localStorage.getItem("avatarLink");

const postBlog = (e) => {
  e.preventDefault();
  const postNotification = document.getElementById("post-notification");
  postNotification.innerHTML = "";

  const blogContent = document.getElementById("blog-text").value;
  console.log(blogContent);

  const form = document.getElementById("blog-post-form");
  const formData = new FormData(form);

  const fetchOptions = {
    method: "POST",
    body: formData,
  };
  //send images and text content to backend
  fetch("/protected/post-blog", fetchOptions);
};

<<<<<<< HEAD
document.addEventListener(
  "DOMContentLoaded",
  function () {
    autosize(document.querySelectorAll("#blog-text"));
  },
  false
);
=======
document.addEventListener('DOMContentLoaded', function() {
  autosize(document.querySelectorAll('#blog-text'));
}, false);

$(document).ready(function()
		{
      $(".fa-bell").click(function()
			{
				$(".dropdown").toggleClass("active");
			})
		});
>>>>>>> 9e70bffd5c140e198286dce95dc208ba8a3ab382

// $(document).ready(function () {
//   $(".notifications .fa-bell").click(function () {
//     $(".dropdown").toggleClass("active");
//   });
// });

const dropdown = document.getElementsByClassName("dropdown")[0];
document.getElementsByClassName("fa-bell")[0].addEventListener("click", () => {
  if (dropdown.style.display == "block") dropdown.style.display = "none";
  else dropdown.style.display = "block";
});

// document.addEventListener("click", (e) => {
//   const dropdown = document.getElementsByClassName("dropdown")[0];
//   if (dropdown.classList.contains("active")) {
//     console.log("here");
//     const x = e.offsetX;
//     const y = e.offsetY;
//     if (
//       x < dropdown.offsetLeft ||
//       y < dropdown.offsetTop ||
//       x > dropdown.offsetLeft + dropdown.offsetWidth ||
//       y > dropdown.offsetTop + dropdown.offsetHeight
//     )
//       dropdown.classList.remove("active");
//   }
// });
