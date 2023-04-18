import config from "../config/default";
import nodemailer, { SendMailOptions } from "nodemailer";

// this was for getting the test credentials
// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

const stmp = config.stmp;

const transporter = nodemailer.createTransport({
  ...stmp,
  auth: {
    user: stmp.user,
    pass: stmp.pass,
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
