// import { newpost } from "./dashboard.js";
const userDetails = JSON.parse(localStorage.getItem("userDetails"));
(() => {
  //display all the important information
  document.getElementById("profile-picture").src =
    localStorage.getItem("avatarLink");
  // document.getElementById("commentimage").src =
  //   localStorage.getItem("avatarLink");
  // document.getElementById("image").src = localStorage.getItem("avatarLink");
  document.getElementById(
    "namesetting"
  ).innerHTML = `<strong>${userDetails.username}</strong>`;
  if (userDetails.bio)
    document.getElementById("bio").innerText = userDetails.bio;
  if (userDetails.hobbies)
    document.getElementById(
      "hobbies"
    ).innerHTML = `<strong>Hobbies: </strong>${userDetails.hobbies}`;
})();

const profile = document.getElementById("profile");
const sticky = profile.offsetTop;

// Get the modal
const modal = document.getElementById("passwordchangemsgbox");

// Get the button that opens the modal
const btn = document.getElementById("changeprofile");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

const hideModal = () => (modal.style.display = "none");
// When the user clicks on <span> (x), close the modal
span.onclick = hideModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    hideModal();
  }
};

const submitAvatar = (e) => {
  e.preventDefault();
  const updateAvatarForm = document.getElementById("update-avatar-form");
  const formData = new FormData(updateAvatarForm);

  const fetchOptions = {
    method: "PUT",
    body: formData,
  };
  //send the new avtar to backend
  fetch("/protected/update/avatar", fetchOptions)
    .then((resp) => resp.json())
    .then((response) => {
      response.success &&
        localStorage.setItem("avatarLink", response.avatarLink);
    })
    //reload the page so user can see the avatar has changed
    .then(() => window.location.reload())
    .catch((err) => console.error(err));
};

//to make the Edit Profile button popup in same page
document.getElementById("profileEdit").addEventListener("click", function () {
  document.querySelector(".wrapperContainer").style.display = "flex";
  document.getElementById("username").value = userDetails.username;
  document.getElementById("user-bio").innerText = userDetails.bio
    ? userDetails.bio
    : "";
  document.getElementById("user-hobbies").innerText = userDetails.hobbies
    ? userDetails.hobbies
    : "";
});

/*
const editBlog = document.getElementById("wrapperContainer");

window.onclick = function (event) {
  if (event.target == editBlog) {
    console.log(event.target);
    hideModal();
  }
};
*/

const hideEditProfileForm = () => {
  document.querySelector(".wrapperContainer").style.display = "none";
  window.location.reload();
};

const logout = () => {
  fetch("/protected/logout", {
    method: "DELETE",
  })
    .then((resp) => resp.json())
    .then((response) => {
      if (response.success) {
        localStorage.removeItem("userDetails");
        localStorage.removeItem("avatarLink");
        window.location.assign("/");
      }
    })
    .catch((error) => console.error(`ERROR: ${error}`));
};

const showResponse = (response) => {
  const responseDiv = document.getElementById("response");
  responseDiv.style.color = "#fff";
  //use red background for response
  responseDiv.style.backgroundColor = "red";
  if (response.success) {
    //if the operation was successful, use green background
    responseDiv.style.backgroundColor = "green";

    //if the bio and hobbies were updated, update them in local storage
    if (response.extraMile) {
      const { username, bio, hobbies } = response;
      localStorage.setItem(
        "userDetails",
        JSON.stringify({ username, bio, hobbies })
      );
    }

    //clear the password fields
    document.getElementById("password").value = "";
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-new-password").value = "";
  }

  //display the response
  responseDiv.innerHTML = response.message;

  //clear the response after 5 seconds
  setTimeout(() => (responseDiv.innerHTML = ""), 5000);
};

const updateBioHobbies = (e) => {
  e.preventDefault();
  const bio = document.getElementById("user-bio").value;
  const hobbies = document.getElementById("user-hobbies").value;

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bio, hobbies }),
  };
  fetch("/protected/update/bio-and-hobbies", fetchOptions)
    .then((resp) => resp.json())
    .then((response) => showResponse(response))
    .catch((err) => console.error(err));
};

const updateUsername = (e) => {
  e.preventDefault();
  const newUsername = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newUsername, password }),
  };

  fetch("/protected/update/username", fetchOptions)
    .then((res) => res.json())
    .then((response) => {
      showResponse(response);
    });
};

const updatePassword = (e) => {
  e.preventDefault();
  const password = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-new-password").value;

  const passwordRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

  //if the user enters same password in the new password field
  if (password === newPassword) {
    return showResponse({
      success: false,
      message: `New password cannot be the same as old password`,
    });
  }

  //if the new password is not strong enough
  if (!passwordRegex.test(newPassword)) {
    return showResponse({
      success: false,
      message: `The new password isn't strong enough.`,
    });
  }

  //if the new password and confirm password do not match
  if (newPassword !== confirmPassword) {
    return showResponse({
      success: false,
      message: `The new passwords do not match.`,
    });
  }

  //if everything is fine, send the information to server
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, newPassword }),
  };
  fetch("/protected/update/password", fetchOptions)
    .then((res) => res.json())
    .then((response) => showResponse(response))
    .catch((err) => console.error(err));
};

const newpost = (blog) => {
  const blogsContainer = document.getElementById("blogcss");
  // console.log(blog);
  const x = document.createElement("div");
  x.classList.add("blogs");

  const dateTime = blog.date.split("-");

  let blogImageUrl = "./assets/journal.jpg";
  let tagsDiv = "";

  const images = blog.links.split(", ");
  images.shift();
  if (images.length) blogImageUrl = images[0];

  // if (blog.tags.length) {
  //   tagsDiv = blog.tags.reduce((acc, elem) => {
  //     if (TAGS.indexOf(elem) == -1) {
  //       const newTag = document.createElement("div");
  //       newTag.setAttribute("onclick", `tags("${elem}")`);
  //       const tagText =
  //         elem.includes("_") || elem.includes("-")
  //           ? elem.substr(1)
  //           : elem.substr(1, 1).toUpperCase() + elem.substr(2);
  //       //REMOVE # AND CAPITALIZE THE FIRST LETTER IN TAGS
  //       newTag.innerHTML = `<button>${tagText}</button>`;
  //       tagsSection.appendChild(newTag);
  //       TAGS.push(elem);
  //     }
  //     return `${acc}<div class="blog-category">${elem}</div>`;
  //   }, "");
  // }

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

const blog = () => {
  const id = localStorage.getItem("userId");
  // console.log(id);
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  };
  fetch("/protected/getblogbyid", fetchOptions)
    .then((res) => res.json())
    .then((response) => {
      // response.forEach((resp) => newpost(resp));
      console.log(response);
      response.forEach((resp) => newpost(resp));
    });
};

blog();

const toggleOptionList = () => {
  console.log("workgin");
};

const deleteBlog = () => {
  console.log("hmm");
  console.log("uhhhuh");
};
