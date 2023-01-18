const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "shreya.sur1994@gmail.com",
    subject: "Thanks for joining in!",
    text: `Welcome to the app ${name}. Let us know do you get along with this app.`,
  });
};

const sendCancelMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "shreya.sur1994@gmail.com",
    subject: "We will miss you!",
    text: `Goodbye ${name}. Hope to see you sometime soon.`,
  });
};

module.exports = {
  sendWelcomeMail,
  sendCancelMail,
};
