const nodemailer = require('nodemailer');

module.exports = async ({ from, to, subject, text, html }) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        Port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    //Send mail with defined transport object
    let info = await transporter.sendMail({
        from: `inshare <${from}>`,
        to,
        subject,
        text,
        html
    });
    
}

