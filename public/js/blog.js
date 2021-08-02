const blogId = location.href.split("=")[1];

document.getElementById("user-avatar").src = localStorage.getItem("avatarLink");

const wrapBlog = (blog) => {
  const images = blog.links.split(", ");
  images.shift();
  if (images.length) {
    const imageContainer = document.getElementById("card-image");
    const img = document.createElement("img");
    img.setAttribute("alt", "blog-image");
    img.setAttribute("src", images[0]);
    imageContainer.appendChild(img);
  }

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
  let clas = "";
  let id = "";

  if (LikeStatus) {
    clas = "fas fa-heart";
    id = "fill-red";
  } else {
    clas = "far fa-heart";
    id = "fill-none";
  }

  const likesharecount = document.getElementById("likesharecmt");
  likesharecount.innerHTML = `
    <i onclick="Like(${LikeStatus})" class="${clas}" id=${id} style="font-size: 20px"></i>
    <p id="LikeNo">${LikeNo}</p>
    <i class="far fa-comment" style="font-size: 20px"></i>
    <p>${CommentNo}</p>
    <i class="fas fa-share" style="font-size: 20px"></i>
    `;

  blog.comments.forEach((data) => {
    comment(data);
  });
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
          
                      </div>
    `;

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
  console.log(LikeStatus);
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
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i,
    slides = document.getElementsByClassName("blogImages"),
    dots = document.getElementsByClassName("demo"),
    captionText = document.getElementById("caption");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  captionText.innerHTML = dots[slideIndex - 1].alt;
}
