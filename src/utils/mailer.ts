import config from "../config/default";
import nodemailer, { SendMailOptions } from "nodemailer";

// this was for getting the test credentials
// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

// use the smtp constant for testing purposes.
// const smtp = config.smtp;

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE!,
  auth: {
    user: process.env.NODEMAILER_USER!,
    pass: process.env.NODEMAILER_PASS!,
  },
});
async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(nodemailer.getTestMessageUrl(info));
  });
}

export default sendEmail;
