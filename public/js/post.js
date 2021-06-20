
// document.addEventListener('DOMContentLoaded', function() {
//   autosize(document.querySelectorAll('#blog-text'));
// }, false); 

// Image Preview

var loadFile = function(event) {
	var image = document.getElementById('prev-img');
	image.src = URL.createObjectURL(event.target.files[0]);
};

// Tags writing area

function onEvent(event) {
  if (event.key === "Enter" || event.keyCode === 32) {
    var x = event.key;
    event.preventDefault();
    var tagText = document.getElementById('write-tag').value;
    if(tagText[0] != null){
      
    
    var btn = document.createElement("BUTTON");
    btn.className = "tags";
    if(tagText[0]=="#"){
      btn.innerHTML = tagText + "  ";}
    else{
    btn.innerHTML = "#" + tagText + "  ";}
    document.getElementById('tag-area').appendChild(btn);

    var len = document.getElementsByClassName('tags');
    // console.log(len.length);
    var cross = document.createElement("BUTTON");
    cross.className = "remove";
    cross.innerHTML = "X";
    document.getElementsByClassName('tags')[len.length-1].appendChild(cross);
    console.log(len.length-1);

    // for (var i = 0; i < (len.length-1); i++) {
    // document.getElementsByClassName('tags')[len.length-1].addEventListener('click', function() {
    //   var element = document.getElementsByClassName('tags'); 
    //   element.parentNode.removeChild(element); 
    // })}


    document.getElementsByClassName('tags')[len.length-1].addEventListener('click', function(e) {
      // e.currentTarget.parentNode.remove();
      this.closest('.tags').remove() // in modern browsers in complex dom structure
      //this.parentNode.remove(); //this refers to the current target element 
      //e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }, false);

    document.getElementById('write-tag').value = "";
  }
  }
};

document.getElementById("write-tag").addEventListener("keypress", onEvent);

function clearTags() {
  var myobj = document.getElementsByClassName("tags");
  var lastSelect = myobj[myobj.length-1];
  lastSelect.remove();

  // var myobj = document.getElementsByClassName("tags")[0];
  // var len = document.querySelectorAll('tags').length;

  // for (var i = 0; i < len; i++) {
  //   myobj[i].remove;
  // }

  // var delTags = document.getElementsByClassName("tags")[0];
  // var len = delTags.length;
  // console.log(len);
  // for (var i = 0; i < len; i++) {
  //   if (delTags[i].className.toLowerCase() == "tags") {
  //   delTags[i].parentNode.removeChild(delTags[i]);
// }
// }
}

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

