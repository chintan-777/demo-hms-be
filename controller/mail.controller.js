const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  res.send({});
  let info = await transporter.sendMail(
    {
      from: process.env.MAIL_ID,
      to: "chintansojitra136@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );

  console.log("Message sent: %s", info);
};
