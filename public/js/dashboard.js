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

