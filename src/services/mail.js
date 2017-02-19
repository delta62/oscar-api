const { createTransport } = require('nodemailer');
const config = require('config');

function sendMail(user, pin) {
  console.log(`Sending PIN mail to ${user.email} with PIN ${pin}`);

  if (!config.has('mail.from') || !config.get('mail.from')) {
    console.log('No mail service configured; not sending anything');
    return;
  }

  let defaults = {
    from: config.get('mail.from'),
    subject: 'Your login PIN'
  };

  let transport = {
    host: config.get('mail.host'),
    port: config.get('mail.port'),
    secure: config.get('mail.secure'),
    auth: {
      user: config.get('mail.from'),
      password: config.get('mail.pass')
    }
  };

  let transporter = createTransport(transport, defaults);

  transporter.verify(err => {
    if (err) {
      console.error(err);
    } else {
      let data = {
        to: user.email,
        text: `Your PIN number is ${pin}.`
      };

      transporter.sendMail(data, err => {
        if (err) {
          console.error('Error sending mail');
          console.error(err);
        }
      });
    }
  });
}

module.exports = {
  sendMail: sendMail
};
