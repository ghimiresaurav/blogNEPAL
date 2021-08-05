console.log("contact us");

const recordResponse = (e) => {
  e.preventDefault();
  const name = document.getElementById("name-input").value;
  const phone = document.getElementById("phone-input").value;
  const email = document.getElementById("email-input").value;
  const company = document.getElementById("company-input").value;
  const issueAbout = document.getElementById("select-field").value;
  const issueDesctiption = document.getElementById("issue-description").value;
  const status = document.getElementById("status");

  fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      phone,
      email,
      company,
      issueAbout,
      issueDesctiption,
    }),
  })
    .then((resp) => resp.json())
    .then((response) => {
      status.style.backgroundColor = "red";
      status.style.boxShadow = "5px 5px 15px rgb(49, 47, 47)";
      if (response.success) {
        status.style.backgroundColor = "green";
        document.getElementById("name-input").value = "";
        document.getElementById("phone-input").value = "";
        document.getElementById("email-input").value = "";
        document.getElementById("company-input").value = "";
        document.getElementById("select-field").value = "";
        document.getElementById("issue-description").value = "";
      }
      status.innerHTML = `<strong>${response.message}</strong>`;
    })
    .catch((err) => console.error(err));
};
