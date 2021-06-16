(() => {
  const currentLocation = location.href;
  const menuItem = document.querySelectorAll("a");
  const menuLength = menuItem.length;
  for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
      menuItem[i].classList.add("active");
    }
  }
})();

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
  let commentsDiv = "";
  const imagesUrls = blog.links.split(", ");
  imagesUrls.shift();

  const commentForm = `<form onsubmit="postComment(event, this.parentNode.parentNode.id, this.firstElementChild.value)">
  <input type="text" placeholder="Post a comment...">
  <button type="submit" class="send-btn">
    <i class="fas fa-paper-plane"></i>
  </button>
</form>`;

  if (imagesUrls.length)
    imageDiv = `
  <div class="post-image">
  <img id="image" src="${imagesUrls[0]}">
  </div>`;

  if (blog.comments) {
    console.log(blog.comments[0]);
    const x = blog.comments.reduce(
      (c, comment) => `${c}
    <div class="comments">
      <div>
        <img class="comment-images" src=${localStorage.getItem("avatarLink")} />
      </div>
      <div class="comment-text">
        <p class="comment-name-time">
          <strong>${comment.user.name}</strong>
          <span class="comment-time">${comment.date}</span>
        </p>
        <p>${comment.comment}</p>
      </div>
    </div>`,
      `<div id="comments-list">`
    );
    commentsDiv = `${x}</div>`;
  }

  const blogDiv = document.createElement("div");
  blogDiv.id = blog._id;
  blogDiv.classList.add("blogs");

  const dateTime = blog.postedOn.split("-");

  blogDiv.innerHTML = `
  <p><strong>${blog.author.name}</strong> posted on <strong>${dateTime[0]}</strong>-${dateTime[1]}</p><br>
  <h4>Blog Topic Here</h4><br />
  <p>${blog.content}</p>
  ${imageDiv}
  ${lscTagDiv}
  <div class="comment">
  ${commentForm}
  ${commentsDiv}
  </div>`;
  blogsContainer.appendChild(blogDiv);
};

fetch("/protected/get-blogs")
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

$(document).ready(function () {
  $(".fa-bell").click(function () {
    $(".dropdown").toggleClass("active");
  });
});

// for navBar active effect
icons = document.querySelector(".icons").querySelectorAll("i");

icons.forEach((element) => {
  element.addEventListener("click", function () {
    icons.forEach((icons) => icons.classList.remove("active"));

    this.classList.add("active");
  });
});

const postComment = (e, postId, comment) => {
  e.preventDefault();

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, comment }),
  };
  fetch("/protected/post-comment", fetchOptions);
  // .then()
};

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
