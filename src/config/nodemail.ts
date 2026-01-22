import { registerAs } from "@nestjs/config";
// import { config as dotenvConfig } from "dotenv";

// dotenvConfig({ path: ".env" });

const config = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

// console.log("EmailConfig:", config, typeof config.auth.pass);

export const mailerConfig = registerAs("mailer_config", () => config);
