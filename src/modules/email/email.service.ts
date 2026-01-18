import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private transporter;
  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport(config.get("mailer_config"));
  }

  async sendRegisterEmail(email: string, name: string) {
    await this.transporter.sendMail({
      from: '"Liveticket" <no-reply@liveticket.com>',
      to: email,
      subject: "Bienvenido 🎉",
      html: `<body style="color: aliceblue; background-color: rgb(70,70,70);">
              <h1 align="center">Hola ${name}, Bienvenido a Liveticket 🎉</h1>
              <h2 align="center">La mejor tienda de entradas a eventos online</h2>
              <p align="center"><img src="https://pngimg.com/d/welcome_PNG33.png" alt="welcome image" width="300px"> </p>
            </body>`,
    });
  }

  async sendPurchaseEmail(email: string, orderId: string) {
    await this.transporter.sendMail({
      from: '"Liveticket" <no-reply@liveticket.com>',
      to: email,
      subject: "Compra realizada 🧾",
      html: `<p>Tu compra #${orderId} fue exitosa</p>`,
    });
  }

  async sendEmail(email: string, text: string) {
    return await this.transporter.sendMail({
      to: email,
      subject: "Test email",
      html: `${text}`,
    });
  }
}
