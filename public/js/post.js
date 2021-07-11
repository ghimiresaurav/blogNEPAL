// Image Preview
document.getElementById("user-avatar").src = localStorage.getItem("avatarLink");
// const addTag = document.getElementById('add-tag')
const image = document.getElementById("prev-img");
const rightPane = document.getElementById("right-pane");
const RIGHT_PANE_HEIGHT = rightPane.offsetHeight;
var loadFile = function (event) {
  // var image = document.getElementById("prev-img");
  image.src = URL.createObjectURL(event.target.files[0]);
  setTimeout(
    () =>
      (rightPane.style.height = `${RIGHT_PANE_HEIGHT + image.offsetHeight}px`),
    100
  );
};

// Tags writing area

function onEvent(event) {
  if (event.key === "Enter" || event.keyCode === 32) {
    var x = event.key;
    event.preventDefault();
    var tagText = document.getElementById("write-tag").value;
    var count = tagText.length <= 17;
    if (tagText[0] != null) {
      var btn = document.createElement("button");
      btn.setAttribute("type", "button");
      btn.classList.add("tags");
      if (count == true) {
        if (tagText[0] == "#") {
          btn.innerHTML = tagText + " ";
        } else {
          btn.innerHTML = "#" + tagText + " ";
        }
        document.getElementById("tag-area").appendChild(btn);

        var len = document.getElementsByClassName("tags");
        var cross = document.createElement("BUTTON");
        cross.className = "remove";
        cross.innerHTML = "&times;";
        document
          .getElementsByClassName("tags")
          [len.length - 1].appendChild(cross);
        document
          .getElementsByClassName("remove")
          [len.length - 1].addEventListener(
            "click",
            function (e) {
              e.currentTarget.parentNode.remove();
            },
            false
          );

        document.getElementById("write-tag").value = "";
      } else {
        document.getElementById("write-tag").value = "";
        showPopup();
      }
    }
  }
}

function showPopup() {
  var popup = document.getElementById("errorPopup");
  var popA = document.getElementById("popupArrow");

  popup.classList.add("xtra");
  popA.classList.add("xtra");

  popup.classList.remove("error");
  popA.classList.remove("error");

  void popup.offsetWidth;
  void popA.offsetWidth;

  popup.classList.add("error");
  popA.classList.add("error");
}

document.getElementById("write-tag").addEventListener("keypress", onEvent);

function clearTags() {
  var myobj = document.getElementsByClassName("tags");
  for (var i = myobj.length - 1; i >= 0; i--) {
    myobj[i].remove();
    // myobj = document.getElementsByClassName("tags");
  }
}

document.getElementById("clearTags").addEventListener("click", clearTags);

const clearForm = () => {
  document.getElementById("blog-title").value = "";
  document.getElementById("editableDiv").innerHTML = "";
  image.src = "";
  rightPane.style.height = "50vh";
  clearTags();
};

const postBlog = (e) => {
  e.preventDefault();
  const postNotification = document.getElementById("post-notification");
  postNotification.innerHTML = "";

  const tags = Array.from(document.getElementsByClassName("tags")).map((tag) =>
    tag.innerText.split(" ")[0].toLowerCase()
  );

  const content = document.getElementById("editableDiv").innerHTML;

  const form = document.getElementById("blog-post-form");
  const formData = new FormData(form);
  formData.append("tags", tags);
  formData.append("content", content);

  const fetchOptions = {
    method: "POST",
    body: formData,
  };

  //send images and text content to backend
  fetch("/protected/post-blog", fetchOptions);
  postNotification.innerHTML = `<strong>Your blog has been posted successfully. <i class="far fa-thumbs-up"></i></strong>`;
  postNotification.style.top = `15vh`;
  console.log(formData.get("images"));
  formData.delete("images");
  console.log(formData.get("images"));
  clearForm();
  setTimeout(() => {
    postNotification.style.top = "6vh";
    setTimeout(() => (postNotification.innerHTML = ""), 200);
  }, 3000);
};
