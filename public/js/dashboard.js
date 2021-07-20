const blogsContainer = document.getElementById("blogcss");
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
})();

const wrapBlog = (blog) => {
  const LikeNo = blog.like.length;
  const LikeStatus = Likestat(blog.like);
  const CommentNo = blog.comments.length;
  let clas = "";
  let id = "";
  if (LikeStatus) {
    clas = "fas fa-heart";
    id = "fill-red";
  } else {
    clas = "far fa-heart";
    id = "fill-none";
  }

  const lscTagDiv = `<div class="likesharecmt">
  <i onclick="Like(this.parentNode.parentNode.id,${LikeStatus})" class="${clas}" id=${id} style="font-size: 20px"></i>
  <p id="LikeNo">${LikeNo}</p>
  <i class="far fa-comment" style="font-size: 20px"></i>
  <p>${CommentNo}</p>
  <i class="fas fa-share" style="font-size: 20px"></i>
  </div>`;
  let imageDiv = "";
  let commentsDiv = "";
  const imagesUrls = blog.links.split(", ");
  imagesUrls.shift();

  const commentForm = `
  <form onsubmit="postComment(event, this.parentNode.parentNode.id, this.firstElementChild.value)">
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
    const x = blog.comments.reduce(
      (c, comment) => `${c}
      <div class="comments">
        <div>
          <img class="user-images" src=${comment.user.avatar} />
        </div>
        <div class="comment-text">
          <p class="comment-name-time">
            <strong>${comment.user.name}</strong>
            <span class="comment-time">${comment.date}</span>
          </p>
          <p>${comment.body}</p>
        </div>
      </div>`,
      `<div id="comments-list">`
    );
    commentsDiv = `${x}</div>`;
  }

  const blogDiv = document.createElement("div");
  blogDiv.id = blog._id;
  blogDiv.classList.add("blogs");

  const dateTime = blog.date.split("-");

  blogDiv.innerHTML = `
  <h3 class="blog-title">${blog.title}</h3><br />
  <div class="author-details">
    <div>
      <img class="user-images author-images" src=${blog.author.avatar} />
    </div>
  <p><strong>${blog.author.name}</strong> posted on <strong>${dateTime[0]}</strong>-${dateTime[1]}</p><br>
  </div>
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
    data.forEach((datum) => newpost(datum));
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

function tags(value) {
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
        newpost(datum);
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
  console.log(value);
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
        newpost(datum);
      });
    })
    .catch((err) => console.error(err));
});

const navigateToPostPage = () => window.location.assign("/protected/post");

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

const newpost = (blog) => {
  console.log(blog);
  const x = document.createElement("div");
  x.classList.add("blogs");

  const dateTime = blog.date.split("-");

  let blogImageUrl = "./assets/journal.jpg";
  let tagsDiv = "";

  const images = blog.links.split(", ");
  images.shift();
  if (images.length) blogImageUrl = images[0];

  if (blog.tags.length) {
    tagsDiv = blog.tags.reduce((acc, elem) => {
      if (TAGS.indexOf(elem) == -1) {
        const newTag = document.createElement("div");
        newTag.setAttribute("onclick", `tags("${elem}")`);
        const tagText =
          elem.includes("_") || elem.includes("-")
            ? elem.substr(1)
            : elem.substr(1, 1).toUpperCase() + elem.substr(2);
        //REMOVE # AND CAPITALIZE THE FIRST LETTER IN TAGS
        newTag.innerHTML = `<button>${tagText}</button>`;
        tagsSection.appendChild(newTag);
        TAGS.push(elem);
      }
      return `${acc}<div class="blog-category">${elem}</div>`;
    }, "");
  }

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
    ${tagsDiv}
    <div class="blog-body">
      <p>${blog.content}</p>
    </div>
    <a href="/protected/blog?id=${blog._id}" class="ReadButton">Read full Post</a>
  </div>`;

  blogsContainer.appendChild(x);
};
