const { createTransport } = require('nodemailer');
const config = require('config');

function sendMail(user, pin) {
  if (!config.has('mail.host')) {
    console.log('No mail service configured; not sending anything');
    return;
  }

  let transporter = createTransport(config.get('mail'));

  return transporter.verify().then(() => transporter.sendMail({
    from:    config.get('mail.auth.user'),
    subject: 'Log in to the Oscars App',
    to:      user.email,
    text:    `Your login code is ${pin}`
  }));
}

module.exports = {
  sendMail: sendMail
};
