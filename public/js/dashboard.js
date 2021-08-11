const TAGS = [];
const tagsSection = document.getElementById("tags-section");
(() => {
  document.getElementById("user-avatar").src =
    localStorage.getItem("avatarLink");
  const currentLocation = location.href;
  const menuItem = document.querySelectorAll("a");
  const menuLength = menuItem.length;
  for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
      menuItem[i].classList.add("active");
    }
  }
  const tagToSearch = window.location.href.split("searchByTag")[1];
  if (tagToSearch) {
    const tag = tagToSearch.split("=")[1];
    if (tag) setTimeout(() => searchByTags(tag), 500);
  }
})();

fetch("/protected/get-blogs")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((datum) => wrapBlog(datum));
  })
  .catch((err) => console.error(err));

document.addEventListener(
  "DOMContentLoaded",
  function () {
    autosize(document.querySelectorAll("#blog-text"));
  },
  false
);

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
};

const Like = (postId, LikeStatus) => {
  const userId = localStorage.getItem("userId");

  if (LikeStatus) {
    const LikeIcon = findChild(postId, "fill-red");
    LikeIcon.id = "fill-none";
    LikeIcon.className = "far fa-heart";
    LikeIcon.setAttribute(
      "onclick",
      "Like(this.parentNode.parentNode.id,false)"
    );
    const LikeNum = findChild(postId, "LikeNo");
    const number = parseInt(LikeNum.innerHTML) - 1;
    LikeNum.innerHTML = number;
  } else {
    const LikeIcon = findChild(postId, "fill-none");
    LikeIcon.id = "fill-red";
    LikeIcon.className = "fas fa-heart";
    LikeIcon.setAttribute(
      "onclick",
      "Like(this.parentNode.parentNode.id,true)"
    );
    const LikeNum = findChild(postId, "LikeNo");
    const number = parseInt(LikeNum.innerHTML) + 1;
    LikeNum.innerHTML = number;
  }
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId: postId, userId: userId }),
  };
  const res = fetch("/protected/like", fetchOptions);
};

const Likestat = (like) => {
  const userId = localStorage.getItem("userId");
  var __FOUND = false;
  for (var i = 0; i < like.length; i++) {
    if (like[i].id == userId) {
      __FOUND = true;
      break;
    }
  }
  return __FOUND;
};

findChild = (idOfElement, idOfChild) => {
  let element = document.getElementById(idOfElement);
  return element.querySelector(`[id=${idOfChild}]`);
};

//search by tag

function searchByTags(value) {
  const blogDiv = document.getElementById("blogcss");
  while (blogDiv.firstChild) {
    blogDiv.removeChild(blogDiv.firstChild);
  }
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: value }),
  };
  fetch("/protected/search", fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((datum) => {
        wrapBlog(datum);
      });
    })
    .catch((err) => console.error(err));
}

const form = document.getElementById("search");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const search_txt = document.getElementById("search-txt");
  const value = search_txt.value;

  const blogDiv = document.getElementById("blogcss");
  while (blogDiv.firstChild) {
    blogDiv.removeChild(blogDiv.firstChild);
  }
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: value }),
  };
  fetch("/protected/searchblog", fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((datum) => {
        wrapBlog(datum);
      });
    })
    .catch((err) => console.error(err));
});

const navigateToPostPage = () => window.location.assign("/protected/post");

const wrapBlog = (blog) => {
  const blogsContainer = document.getElementById("blogcss");
  const x = document.createElement("div");
  x.classList.add("blogs");

  const dateTime = blog.date.split("-");

  let blogImageUrl = "./assets/journal.jpg";
  const images = blog.links.split(", ");
  images.shift();
  if (images.length) blogImageUrl = images[0];
  
  x.innerHTML = `
  <div class="card-header">
    <img class="card-image" src="${blogImageUrl}" alt="blog-image" />

    <div class="blog-details">
      <h3 class="blog-title">${blog.title}</h3>

      <div class="blog-metas">
        <div class="meta">
          <i class="far fa-user" aria-hidden="true"></i> ${blog.author.name}
        </div>
        <div class="meta">
          <i class="far fa-calendar" aria-hidden="true"></i> ${dateTime[0]}
        </div>
        <div class="meta">
          <i class="far fa-clock" aria-hidden="true"></i> ${dateTime[1]}
        </div>
      </div>

    </div>
  </div>

  <div class="card-body">  
    <div class="blog-body">
      <p>${blog.content}</p>
    </div>
    <a href="/protected/blog?id=${blog._id}" class="ReadButton">Read full Post</a>
  </div>`;

  blogsContainer.appendChild(x);
};
