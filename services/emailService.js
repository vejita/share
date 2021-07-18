const nodemaler = require('nodemailer');

async function sendMail({ from, to, subject, text, html }) {
    let transporter = nodemaler.createTransport({
        host: process.env.SMTP_HOST,
        PORT: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from: `inShare <${from}>`,
        to,
        subject,
        text,
        html,
    });
}
module.exports = sendMail;
