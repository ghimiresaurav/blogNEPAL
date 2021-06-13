
document.addEventListener(
  "DOMContentLoaded",
  function () {
    autosize(document.querySelectorAll("#blog-text"));
  },
  false
);

var loadFile = function(event) {
	var image = document.getElementById('prev-img');
	image.src = URL.createObjectURL(event.target.files[0]);
};