console.log("here");
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
  document.getElementById("like-count").innerText = blog.like.length;
  document.getElementById("comment-count").innerText = blog.comments.length;
};

fetch(`/protected/blog/${blogId}`)
  .then((resp) => resp.json())
  .then((response) => {
    console.log(response);
    wrapBlog(response);
  });

const deleteThisBlog = () => deleteBlog(blogId);

const deleteBlog = (blogId) => {
  fetch("/protected/deleteBlog", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blogId }),
  })
    .then((resp) => resp.json())
    .then((response) => {
      console.log(response.message);
    })
    .catch((err) => console.error(err));
};
