const nodemailer = require('nodemailer');

async function send(email, link) {
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,//port for secure SMTP
    secure: true,
    auth: {
      user: "on.time.by.alpha.team@outlook.com",
      pass: "Mahdighadaasmaoumaymaelyes",
    },
  });
  let info = transporter.sendMail({
    from: 'on.time.by.alpha.team@outlook.com',
    to: email,
    subject: "Password reset link",
    text: "Click on this link to go to change your password",
    html: "Click on this link to go to change your password<hr>" + link + "<br> Beware this link is valid only for 24 hours <hr><H4>On time <3 </H4>",
  });
}

module.exports = send;