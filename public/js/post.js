//initialize tinymce textarea
tinymce.init({
  selector: "textarea#blog-txt",
  plugins:
    "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
  imagetools_cors_hosts: ["picsum.photos"],
  menubar: "file edit view insert format tools table help",
  toolbar:
    "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
  toolbar_sticky: true,
  autosave_ask_before_unload: true,
  autosave_interval: "30s",
  autosave_prefix: "{path}{query}-{id}-",
  autosave_restore_when_empty: false,
  autosave_retention: "2m",
  image_advtab: true,
  link_list: [
    { title: "My page 1", value: "https://www.tiny.cloud" },
    { title: "My page 2", value: "http://www.moxiecode.com" },
  ],
  image_list: [
    { title: "My page 1", value: "https://www.tiny.cloud" },
    { title: "My page 2", value: "http://www.moxiecode.com" },
  ],
  image_class_list: [
    { title: "None", value: "" },
    { title: "Some class", value: "class-name" },
  ],
  importcss_append: true,
  file_picker_callback: function (callback, value, meta) {
    /* Provide file and text for the link dialog */
    if (meta.filetype === "file") {
      callback("https://www.google.com/logos/google.jpg", {
        text: "My text",
      });
    }

    /* Provide image and alt text for the image dialog */
    if (meta.filetype === "image") {
      callback("https://www.google.com/logos/google.jpg", {
        alt: "My alt text",
      });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === "media") {
      callback("movie.mp4", {
        source2: "alt.ogg",
        poster: "https://www.google.com/logos/google.jpg",
      });
    }
  },
  templates: [
    {
      title: "New Table",
      description: "creates a new table",
      content:
        '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
    },
    {
      title: "Starting my story",
      description: "A cure for writers block",
      content: "Once upon a time...",
    },
    {
      title: "New list with dates",
      description: "New List with dates",
      content:
        '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
    },
  ],
  template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
  template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
  height: 600,
  image_caption: true,
  quickbars_selection_toolbar:
    "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
  noneditable_noneditable_class: "mceNonEditable",
  toolbar_mode: "sliding",
  contextmenu: "link image imagetools table",
  skin: "oxide",
  content_css: "default",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
});

// Image Preview
document.getElementById("user-avatar").src = localStorage.getItem("avatarLink");
const image = document.getElementById("prev-img");
const rightPane = document.getElementById("right-pane");
const RIGHT_PANE_HEIGHT = rightPane.offsetHeight;
var loadFile = function (event) {
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
  }
}

document.getElementById("clearTags").addEventListener("click", clearTags);

const postNotification = document.getElementById("post-notification");
const clearForm = () => {
  document.getElementById("blog-title").value = "";
  image.src = "";
  rightPane.style.height = "50vh";
  clearTags();
  tinymce.get("blog-txt").setContent("");
  setTimeout(() => {
    postNotification.style.top = "6vh";
    setTimeout(() => (postNotification.innerHTML = ""), 200);
  }, 3000);
};

const postBlog = (e) => {
  e.preventDefault();
  postNotification.innerHTML = "";

  const tags = Array.from(document.getElementsByClassName("tags")).map((tag) =>
    tag.innerText.split(" ")[0].toLowerCase()
  );

  const content = tinymce.get("blog-txt").getContent();

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
  // formData.delete("images");
  // clearForm();
};
