const form = document.getElementById("register-form");
const notification = document.getElementById("notification");

const setToInitialState = (fields) => {
  fields.forEach((field) => {
    field.style.border = `none`;
    field.style.borderBottom = `1px solid #000`;
    field.style.borderRadius = `0`;
  });
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //regular expressions for email validation and password strength check
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const passwordRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

  //grab input fields
  const fields = [];
  fields.push(
    document.getElementById("email"),
    document.getElementById("password"),
    document.getElementById("re-password"),
    document.getElementById("name")
  );

  //set everything to initial state
  setToInitialState(fields);
  notification.innerText = ``;

  //grab the inputs entered by the user
  const email = fields[0].value;
  const password = fields[1].value;
  const repassword = fields[2].value;
  const name = fields[3].value;

  //check if entered email is valid
  if (!emailRegex.test(email)) {
    //the email is invalid
    fields[0].style.border = `1px solid red`;
    fields[0].style.borderRadius = `5px`;
    notification.innerText = `The email you entered is invalid. Please enter a valid email and try again.`;
    return;
  }

  //check if the password entered is strong enough
  if (passwordRegex.test(password)) {
    //the password is strong
    fields[1].style.border = `1px solid green`;
    fields[1].style.borderRadius = `5px`;
    if (password === repassword) {
      //if the passwords in both fields match, put a green border around the password fields
      fields[2].style.border = `1px solid green`;
      fields[2].style.borderRadius = `5px`;
    }
  } else {
    //the password is not strong enough
    fields[1].style.border = `1px solid red`;
    fields[1].style.borderRadius = `5px`;
    notification.innerText = `Password must be at least 8 character long and contain an uppercase letter, a lowercase letter, a digit, and a  special character.`;
    return;
  }

  if (password !== repassword) {
    //the password entered does not match with the password entered in the re-enter field
    fields[1].style.border = `1px solid red`;
    fields[1].style.borderRadius = `5px`;
    fields[2].style.border = `1px solid red`;
    fields[2].style.borderRadius = `5px`;
    notification.innerText = `The passwords do not match.`;
    return;
  }

  //send the inputs to server
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
  };
  fetch("/register", fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      notification.style.backgroundColor = data.success ? "green" : "red";
      notification.innerHTML = `<strong>${data.message}</strong>`;
      if (data.success) {
        //clear the input fields
        fields.forEach((field) => {
          field.value = "";
        });
        //set every input field back to the initial state
        setToInitialState(fields);
        //clear notification 3seconds later
        setTimeout(() => (notification.innerHTML = ``), 3000);
      }
    });
});
