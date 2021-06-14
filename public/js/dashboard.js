const blogsContainer = document.getElementById("blogcss");
const wrapBlog = (blog) => {
  const lscTagDiv = `<div class="likesharecmt">
    <i class="far fa-heart" style="font-size: 20px"></i>
    <p>100</p>
    <i class="far fa-comment" style="font-size: 20px"></i>
    <p>100</p>
    <i class="fas fa-share" style="font-size: 20px"></i>
  </div>`;
  let imageDiv = "";
  const imagesUrls = blog.links.split(", ");
  imagesUrls.shift();

  console.log(imagesUrls);
  if (imagesUrls.length)
    imageDiv = `
  <div class="post-image">
    <img id="image" src="${imagesUrls[0]}">
  </div>`;

  const blogDiv = document.createElement("div");
  blogDiv.classList.add("blogs");

  const dateTime = blog.postedOn.split("-");

  blogDiv.innerHTML = `<p><strong>${blog.author.name}</strong> posted on <strong>${dateTime[0]}</strong>-${dateTime[1]}</p><br>
  <h4>Blog Topic Here</h4><br />
  <p>${blog.content}</p>
  ${imageDiv}
  ${lscTagDiv}`;
  blogsContainer.appendChild(blogDiv);
};

fetch("/protected/get-blogs", {
  method: "GET",
  headers: {
    "Content-type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    data.forEach((datum) => wrapBlog(datum));
  })
  .catch((err) => console.error(err));

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
  postNotification.innerHTML = `<strong>Your blog has been posted successfully. <i class="far fa-thumbs-up"></i></strong>`;
  setTimeout(() => (postNotification.innerHTML = ""), 3000);
};

document.addEventListener(
  "DOMContentLoaded",
  function () {
    autosize(document.querySelectorAll("#blog-text"));
  },
  false
);

const dropdown = document.getElementsByClassName("dropdown")[0];
document.getElementsByClassName("fa-bell")[0].addEventListener("click", () => {
  if (dropdown.style.display == "block") dropdown.style.display = "none";
  else dropdown.style.display = "block";
});

$(document).ready(function()
		{
      $(".fa-bell").click(function()
			{
				$(".dropdown").toggleClass("active");
			})
		});

// for navBar active effect
icons = document.querySelector(".icons").querySelectorAll("i");
      console.log(icons);

icons.forEach(element => {
        element.addEventListener("click", function(){
          icons.forEach(icons=>icons.classList.remove("active"))

        this.classList.add("active");
      })
      
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
