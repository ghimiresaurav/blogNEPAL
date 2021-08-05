const fs = require("fs");
const date = require("../utils/getTime");

module.exports = (req, res) => {
  const { name, phone, email, company, issueAbout, issueDesctiption } =
    req.body;

  const content = `
   --RESPONSE START--

    Date: ${date}
    Issue About: ${issueAbout}
    Description: ${issueDesctiption}

    Name: ${name}
    Phone: ${phone}
    Email: ${email}
    Company: ${company}

    --RESPONSE END--


    `;

  fs.appendFile("contact_response.txt", content, (err) => {
    if (err)
      return res.json({
        success: false,
        message:
          "There was a problem recording your message. Chances are we're already working on it. Thank You.",
      });
    return res.json({
      success: true,
      message:
        "Thank You, your message has been recorded and will be reviewed shortly.",
    });
  });
};
