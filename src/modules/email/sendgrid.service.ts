import { Injectable, Logger } from "@nestjs/common";
import sgMail from "@sendgrid/mail";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async sendPurchaseEmail(email: string, orderId: string) {
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Compra realizada",
        html: `<p>Tu compra #${orderId} fue exitosa</p>`,
      });

      return { ok: true };
    } catch (error) {
      this.logger.error(error.response?.body || error);
      throw error;
    }
  }

  async sendRegisterEmail(email: string, name: string) {
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Bienvenido 🎉",
        html: `
      <body style="color: aliceblue; background-color: rgb(70,70,70);">
        <h1 align="center">Hola ${name}, Bienvenido a Liveticket 🎉</h1>
        <h2 align="center">La mejor tienda de entradas a eventos online</h2>
        <p align="center">
          <img src="https://pngimg.com/d/welcome_PNG33.png" width="300"/>
        </p>
      </body>
    `,
      });

      return { ok: true };
    } catch (error) {
      this.logger.error(error.response?.body || error);
      throw error;
    }
  }

  async sendEmail(email: string, text: string) {
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Test email",
        html: `${text}`,
      });
      return { ok: true };
    } catch (error) {
      this.logger.error(error.response?.body || error);
      throw error;
    }
  }

  async sendResetPasswordEmail(email: string, name: string, resetLink: string) {
    try {
      await sgMail.send({
        from: process.env.SENDGRID_FROM_EMAIL!,
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
      return { ok: true };
    } catch (error) {
      this.logger.error(error.response?.body || error);
      throw error;
    }
  }
}
