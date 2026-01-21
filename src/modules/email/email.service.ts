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

  async sendResetPasswordEmail(email: string, name: string, resetLink: string) {
    await this.transporter.sendMail({
      from: '"Liveticket" <no-reply@liveticket.com>',
      to: email,
      subject: "Restablecer contraseña 🔐",
      html: `
      <body style="background-color: rgb(70,70,70); color: aliceblue; padding: 20px;">
        <h2 align="center">Hola ${name}</h2>
        <p align="center">
          Recibimos una solicitud para restablecer tu contraseña.
        </p>
        <p align="center">
          Haz clic en el siguiente botón para continuar:
        </p>
        <p align="center">
          <a 
            href="${resetLink}" 
            style="
              background-color: #ff5a5f;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            "
          >
            Restablecer contraseña
          </a>
        </p>
        <p align="center" style="font-size: 12px; margin-top: 20px;">
          Este enlace expira en 15 minutos.<br/>
          Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
      </body>
    `,
    });
  }
}
