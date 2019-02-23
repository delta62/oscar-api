const { createTransport } = require('nodemailer');
const config = require('config');

function sendMail(user, pin, logger) {
  if (!config.has('mail.host')) {
    logger.warn('No mail service configured; not sending anything');
    return;
  }

  const mailOpts = Object.assign({ }, config.get('mail'), {
    logger,
    debug: true
  });

  logger.info({ message: 'mail settings', mailOpts });

  let transporter = createTransport(mailOpts);

  return transporter
    .verify()
    .then(() => transporter.sendMail({
      from:    config.get('mail.auth.user'),
      subject: 'Log in to the Oscars App',
      to:      user.email,
      text:    `Your login code is ${pin}`
    }))
    .catch(err => {
      logger.error({ message: 'error sending email', err });
    });
}

module.exports = {
  sendMail: sendMail
};
