// document.addEventListener('DOMContentLoaded', function() {
//   autosize(document.querySelectorAll('#blog-text'));
// }, false);

// Image Preview
document.getElementById("user-avatar").src = localStorage.getItem("avatarLink");
// const addTag = document.getElementById('add-tag')
const y = document.getElementById("prev-img");
var loadFile = function (event) {
  var image = document.getElementById("prev-img");
  image.src = URL.createObjectURL(event.target.files[0]);
  const rightPane = document.getElementById("right-pane");
  setTimeout(
    () =>
      (rightPane.style.height = `${
        rightPane.offsetHeight + image.offsetHeight
      }px`),
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
    console.log(count);
    if (tagText[0] != null) {
      var btn = document.createElement("BUTTON");
      btn.className = "tags";
      console.log(tagText.length);
      if (count == true) {
        if (tagText[0] == "#") {
          btn.innerHTML = tagText + " ";
        } else {
          btn.innerHTML = "#" + tagText + " ";
        }
        document.getElementById("tag-area").appendChild(btn);

        var len = document.getElementsByClassName("tags");
        // console.log(len.length);
        var cross = document.createElement("BUTTON");
        cross.className = "remove";
        cross.innerHTML = "&times;";
        document
          .getElementsByClassName("tags")
          [len.length - 1].appendChild(cross);
        console.log(len.length - 1);

        // for (var i = 0; i < (len.length-1); i++) {
        // document.getElementsByClassName('tags')[len.length-1].addEventListener('click', function() {
        //   var element = document.getElementsByClassName('tags');
        //   element.parentNode.removeChild(element);
        // })}

        document
          .getElementsByClassName("remove")
          [len.length - 1].addEventListener(
            "click",
            function (e) {
              e.currentTarget.parentNode.remove();
              // this.closest('.remove').remove() // in modern browsers in complex dom structure
              // this.parentNode.remove(); //this refers to the current target element
              //e.target.parentNode.parentNode.removeChild(e.target.parentNode);
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
    console.log(myobj[0]);
    myobj[i].remove();
    // myobj = document.getElementsByClassName("tags");
  }
}
//   // var myobj = document.getElementsByClassName("tags")[0];
//   // var len = document.querySelectorAll('tags').length;

//   // for (var i = 0; i < len; i++) {
//   //   myobj[i].remove;
//   // }

//   // var delTags = document.getElementsByClassName("tags")[0];
//   // var len = delTags.length;
//   // console.log(len);
//   // for (var i = 0; i < len; i++) {
//   //   if (delTags[i].className.toLowerCase() == "tags") {
//   //   delTags[i].parentNode.removeChild(delTags[i]);
// // }
// // }

// var rmv = document.getElementsByClassName('remove')

// for (var i = 0; i < rmv.length; i++) {
//   rmv[i].addEventListener('click', function(e) {
//     e.currentTarget.parentNode.remove();
//     //this.closest('.single').remove() // in modern browsers in complex dom structure
//     //this.parentNode.remove(); //this refers to the current target element
//     //e.target.parentNode.parentNode.removeChild(e.target.parentNode);
//   }, false);
// }

// document.querySelectorAll('.some-class').forEach(item => {
//   item.addEventListener('click', event => {
//     var myobj = document.getElementsByClassName("tags");
//     var lastSelect = myobj[myobj.length-1];
//     lastSelect.remove();
//   })
// })

// function removeElementsByClass(tags){
//   const elements = document.getElementsByClassName(tags);
//   while(elements.length > 0){
//       elements[0].parentNode.removeChild(elements[0]);
//   }
// }

document.getElementById("clearTags").addEventListener("click", clearTags);

// var btn = document.querySelector(".edit-btn-one");

// btn.addEventListener("click", function() {
//   var s = editorContent.innerHTML;
//   content.style.display = "block";
//   content.textContent = s;
// });

// var btn = document.getElementsByClassName('bold-btn')

// btn.addEventListener("click", bold, false);

// function bold() {
//   console.log(window.getSelection);
// }
console.log(window.getSelection);

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

  console.log(formData);
  //send images and text content to backend
  fetch("/protected/post-blog", fetchOptions);
  postNotification.innerHTML = `<strong>Your blog has been posted successfully. <i class="far fa-thumbs-up"></i></strong>`;
  postNotification.style.top = `11vh`;
  setTimeout(() => {
    postNotification.style.top = "6vh";
    setTimeout(() => (postNotification.innerHTML = ""), 200);
  }, 3000);
};
