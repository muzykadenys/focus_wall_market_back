const nodemailer = require("nodemailer");
require("dotenv").config();

function sendEmail(emailOptions) {
  // const filePath = file ? file.path : null;
  let mailConfig;

  function generateMailConfig(props) {
    const { name, phone_number, purpose, comment } = props;

    console.log(props);

    let subject = "";
    let title = "";

    subject = "New Order Request";
    title = "You have received a new request";

    let htmlContent = `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <title>${subject}</title>
      </head>
      <body>
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0">
          <p><strong>ПІБ:</strong> ${name}</p>
          <p><strong>Номер телефону:</strong> ${phone_number}</p>
          <p><strong>Коментарі:</strong> ${comment}</p>
          <p><strong>Причина звернення:</strong> ${purpose}</p>
          `;

    htmlContent += `
      <hr style="border: none;" />
      <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
      </div>
      </div>
      </div>
      </body>
      </html>`;

    mailConfig = {
      from: process.env.EMAIL,
      to: process.env.EMAIL_TO,
      subject: subject,
      html: htmlContent,
    };
  }

  generateMailConfig({ ...emailOptions });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailConfig, (error, info) => {
      if (error) {
        console.log(error);
        // if (filePath) {
        //   fs.unlinkSync(filePath);
        // }
        return reject({ message: `An error has occurred` });
      }
      // if (filePath) {
      //   fs.unlinkSync(filePath);
      // }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

module.exports = { sendEmail };
