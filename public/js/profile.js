//sidebar scrool position fix code
window.onscroll = function () { myFunction() };

var navbar = document.getElementById("profiletop");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}





//hide and unhide update profile picture button
var a;
function updateprofile() {
  if (a == 1) {
    document.getElementById("profilepicupdate").style.display = "inline";
    document.getElementById("body").style.opacity = "0.1";
    document.getElementById("header").style.opacity = "0.1";
    return a = 0;
  }
  else {
    document.getElementById("profilepicupdate").style.display = "none";
    document.getElementById("body").style.opacity = "1";
    document.getElementById("header").style.opacity = "1";
    return a = 1;
  }
}
a = 1;



