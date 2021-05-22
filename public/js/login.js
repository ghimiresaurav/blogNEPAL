const socket = io();
const form = document.getElementById("login-form");
const notification = document.getElementById("notification");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  //grab input fields
  const fields = [];
  fields.push(
    document.getElementById("email"),
    document.getElementById("password")
  );

  //set everything to initial state
  fields.forEach((field) => {
    field.style.border = `none`;
    field.style.borderBottom = `1px solid #000`;
    field.style.borderRadius = `0`;
  });
  notification.innerText = ``;

  //grab values entered by user
  const email = fields[0].value;
  const password = fields[1].value;

  //check if the email entered is a valid email
  if (!emailRegex.test(email)) {
    //the email is invalid
    fields[0].style.border = `1px solid #F00`;
    fields[0].style.borderRadius = `5px`;
    notification.innerText =
      "Invalid email. Please re-check email and try again.";
    return;
  }

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  fetch("/login", fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      const { success, message, token } = data;
      // console.log(data);
      if (success) {
        notification.innerHTML = `<strong>login successful</strong>`;
        token && localStorage.setItem("token", token);
        console.log(`token: ${token}`);
        window.location.assign("/dashboard");
      } else notification.innerHTML = `<strong>${message}</strong>`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// if(token)
// localStorage.setItem('token', token);