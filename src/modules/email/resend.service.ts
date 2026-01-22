import { Injectable } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class ResendService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendRegisterEmail(email: string, name: string) {
    await this.resend.emails.send({
      from: "Liveticket <no-reply@liveticket.com>",
      to: email,
      subject: "Bienvenido 🎉",
      html: `<h1>Hola ${name}, bienvenido a Liveticket</h1>`,
    });
  }

  async sendEmail(email: string, text: string) {
    return await this.resend.emails.send({
      from: "Liveticket <no-reply@liveticket.com>",
      to: email,
      subject: "Test email",
      html: `${text}`,
    });
  }
}
