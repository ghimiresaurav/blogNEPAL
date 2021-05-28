fetch("/dashboard", {
  method: "GET",
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));

console.log(localStorage.getItem("token"));
console.log("worelrjlwej");
