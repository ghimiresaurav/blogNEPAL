//sidebar scrool position fix code
window.onscroll = function() {myFunction()};

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
function updateprofile(){
    if(a==1){
        document.getElementById("changeprofile").style.display="inline";
        return a=0;
    }
    else{
        document.getElementById("changeprofile").style.display="none";
        return a=1;
    }
}
a=1;

