const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_ACCOUNT,
    to: email.toString(),
    subject: "MobileMart xin chào ^_^",
    text: code, // plain text body
    html: `Mã xác nhận : ${code}`, // html body
  });
};

module.exports = {
  sendEmail,
};
