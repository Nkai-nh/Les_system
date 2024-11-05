const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendMail = async (to, subject, templateName, context) => {
    const templatePath = path.join(__dirname, '../views', `${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, context);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
};