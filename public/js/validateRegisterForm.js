const form = document.querySelector("form");
const notification = document.getElementById("notification");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

  const fields = [];
  fields.push(
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("re-password")
  );

  //set everything to initial state
  fields.forEach((field) => {
    field.style.border = `none`;
    field.style.borderBottom = "1px solid black";
    field.style.borderRadius = `0`;
  });
  notification.innerText = ``;

  const name = document.getElementById("name").value;
  const email = fields[0].value;
  const password = fields[1].value;
  const repassword = fields[2].value;

  if (!emailRegex.test(email)) {
    fields[0].style.border = `1px solid red`;
    fields[0].style.borderRadius = `5px`;
    notification.innerText = `The email you entered is invalid. Please enter a valid email and try again.`;
    return;
  }

  if (password !== repassword) {
    fields[1].style.border = `1px solid red`;
    fields[1].style.borderRadius = `5px`;
    fields[2].style.border = `1px solid red`;
    fields[2].style.borderRadius = `5px`;
    notification.innerText = `The passwords do not match.`;
    return;
  }

  if (passwordRegex.test(password)) {
    fields[1].style.border = `1px solid green`;
    fields[1].style.borderRadius = `5px`;
    if (password === repassword) {
      fields[2].style.border = `1px solid green`;
      fields[2].style.borderRadius = `5px`;
    }
  } else {
    fields[1].style.border = `1px solid red`;
    fields[1].style.borderRadius = `5px`;
    notification.innerText = `Password must be at least 8 character long and contain an uppercase letter, a lowercase letter, a digit, and a  special character.`;
    return;
  }

  const formData = new FormData(form);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  };
  fetch("/register/new-user", options);
});
