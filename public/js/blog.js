const blogId = location.href.split("=")[1];
const row = document.getElementById("row");
let images, prevSlide;

document.getElementById("user-avatar").src = localStorage.getItem("avatarLink");

const wrapBlog = (blog) => {
  images = blog.links.split(", ");
  images.shift();
  if (images.length) {
    max = images.length;

    images.forEach((image, index) => {
      //create a column (parent) div for each image tag
      const column = document.createElement("div");
      column.classList.add("column");
      //add "active" class to the first slide by default
      const imgClass = index == 0 ? "demo active" : "demo";
      column.innerHTML = `<img class="${imgClass}" src="${image}" style="width: 100%" onclick="changeSlide(this, ${
        index + 1
      })">`;
      row.appendChild(column);
    });
    //as soon as the first columns(images' parents) are appended to the row div
    //initialize prevSlide as the first column in the row div
    prevSlide = row.children[0].firstElementChild;
  }

  //display the blog on the screen
  document.getElementById("blog-title").innerText = blog.title;
  document.getElementById("auth-avatar").firstElementChild.src =
    blog.author.avatar;
  document.getElementById("auth-name").innerText = blog.author.name;
  document.getElementById("calendar").innerText = blog.date;
  document.getElementById("blog-body").innerHTML = blog.content;

  //like comment count section
  const LikeNo = blog.like.length;
  const CommentNo = blog.comments.length;
  const LikeStatus = Likestat(blog.like);
  let clas = "",
    id = "";

  if (LikeStatus) {
    clas = "fas fa-heart";
    id = "fill-red";
  } else {
    clas = "far fa-heart";
    id = "fill-none";
  }

  document.getElementById("likesharecmt").innerHTML = `
    <i onclick="Like(${LikeStatus})" class="${clas}" id=${id} style="font-size: 20px"></i>
    <p id="LikeNo">${LikeNo}</p>
    <i class="far fa-comment" style="font-size: 20px"></i>
    <p>${CommentNo}</p>
    <i class="fas fa-share" style="font-size: 20px"></i>
    `;

  blog.comments.forEach((data) => {
    comment(data);
  });

  const tagsSection = document.getElementById("tagBottom");
  if (blog.tags.length) {
    tagsDiv = blog.tags.reduce((acc, elem) => {
      const newTag = document.createElement("div");
      newTag.setAttribute("onclick", `searchBlogsByTags("${elem}")`);
      newTag.innerHTML = `<button>${elem}</button>`;
      tagsSection.appendChild(newTag);
      return `${acc}<div class="blog-category">${elem}</div>`;
    }, "");
  }
  showSlides(slideIndex);
};

//render comment

const comment = (comment) => {
  const cmt_list = document.getElementById("comment-list");
  const cmt = document.createElement("div");
  cmt.innerHTML = `
    <div class="comments">
      <div>
        <img id="commentimage" src=${comment.user.avatar} alt="pic"/>
      </div>
      <div class="comment-text">
        <p><strong>${comment.user.name} </strong>
        <span class="comment-time">${comment.date}</span></p>
        <p>${comment.body} </p>
      </div>
    </div>`;
  cmt_list.append(cmt);
};

//checks if liked or not return true if likes false if not liked so that like color changes

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

//run when like button is pressed and like parameter is send to backend
const Like = (LikeStatus) => {
  const userId = localStorage.getItem("userId");

  if (LikeStatus) {
    const LikeIcon = document.getElementById("fill-red");
    LikeIcon.id = "fill-none";
    LikeIcon.className = "far fa-heart";
    LikeIcon.setAttribute("onclick", "Like(false)");
    const LikeNum = document.getElementById("LikeNo");
    const number = parseInt(LikeNum.innerHTML) - 1;
    LikeNum.innerHTML = number;
  } else {
    const LikeIcon = document.getElementById("fill-none");
    LikeIcon.id = "fill-red";
    LikeIcon.className = "fas fa-heart";
    LikeIcon.setAttribute("onclick", "Like(true)");
    const LikeNum = document.getElementById("LikeNo");
    const number = parseInt(LikeNum.innerHTML) + 1;
    LikeNum.innerHTML = number;
  }
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId: blogId, userId: userId }),
  };
  const res = fetch("/protected/like", fetchOptions);
};

//post comment in backend
const postComment = (e, comment) => {
  e.preventDefault();
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId: blogId, comment: comment }),
  };
  fetch("/protected/post-comment", fetchOptions);
};

fetch(`/protected/blog/${blogId}`)
  .then((resp) => resp.json())
  .then((response) => {
    wrapBlog(response);
  });

// for image carousel
let slideIndex = 1;

function showSlides(n) {
  const image = document.getElementById("blog-image"),
    max = images.length;

  if (n > max) {
    slideIndex = 1;
  } else if (n < 1) {
    slideIndex = max;
  }

  image.src = images[slideIndex - 1];
  document.getElementById("numbertext").innerText = `${slideIndex} / ${max}`;
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

const changeSlide = (nextSlide, n) => {
  prevSlide.classList.remove("active");
  nextSlide.classList.add("active");

  prevSlide = nextSlide;
  currentSlide(n);
};

function plusSlides(n) {
  //get all the column elements
  const columns = Array.from(row.children);
  //filter out the column element with "active" class
  const activeColumn = columns.filter((item) =>
    item.firstElementChild.classList.contains("active")
  )[0];

  //get the image div of the active column with "activeColumn.firstElementChild"
  //get it's onclick attribute which is "changeSlide(this, i)", a string ofc
  //split it with ", " to get ["changeSlide(this", "i)"]
  //take the first element(i.e. "i)") and disregard the zeroth
  //split it again with ")" to get  ["i", ""]
  //take the zeroth element(i.e. "i") and parse it with parseInt() function
  //finally currentSlideIndex = i (int)

  const currentSlideIndex = parseInt(
    activeColumn.firstElementChild
      .getAttribute("onclick")
      .split(", ")[1]
      .split(")")[0]
  );

  let nextSlide;

  if (n == 1) {
    //the user clicked on next slide button
    if (currentSlideIndex == columns.length) {
      //the current slide on the screen is the last slide
      nextSlide = columns[0].firstElementChild;
      changeSlide(nextSlide, (slideIndex += n));
    } else {
      nextSlide = activeColumn.nextElementSibling.firstElementChild;
      changeSlide(nextSlide, (slideIndex += n));
    }
  } else if (n == -1) {
    //the user clicked on previous slide button
    if (currentSlideIndex == 1) {
      //the current slide on the screen is the first slide
      nextSlide = columns[columns.length - 1].firstElementChild;
      changeSlide(nextSlide, (slideIndex += n));
    } else {
      nextSlide = activeColumn.previousElementSibling.firstElementChild;
      changeSlide(nextSlide, (slideIndex += n));
    }
  }
}

const searchBlogsByTags = (tag) =>
  window.location.assign(`/protected/dashboard?searchByTag=${tag}`);

const searchByCategory = (tag) =>
  window.location.assign(`/protected/dashboard?searchByCat=${tag}`);
