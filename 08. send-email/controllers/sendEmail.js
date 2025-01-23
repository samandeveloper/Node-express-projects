const nodemailer = require('nodemailer')  //import nodemailer

const sendEmail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    //add our credentials as an object
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "brooks19@ethereal.email",
      pass: "Adw2BfzuA6jzUKq7Vv",
    },
  });

  //write email
  let info = await transporter.sendMail({
    from: '"Send MAil Project" <info@samanmohaghegh.online>',
    to: "bar@example.com, baz@example.com", //if we want to send it to various emails we use ,
    subject: "Hello",
    html: "<h2>Sending Emails with Node.js</h2>", //we can use text or html (here we use html)
  });

  res.json(info)

};  //end of sendEmail

module.exports = sendEmail;

