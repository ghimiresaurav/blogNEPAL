// fetch("/dashboard", {
//   method: "GET",
//   headers: {
//     "Content-type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// console.log(localStorage.getItem("token"));
// console.log("worelrjlwej");

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
  console.log(formData);
  fetch("/protected/post-blog", fetchOptions);
};
