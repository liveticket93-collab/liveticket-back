import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private resend: Resend | null = null;

  constructor() {
    const key = process.env.RESEND_API_KEY;

    if (!key) {
      this.logger.warn("RESEND_API_KEY no está configurada. Emails deshabilitados en este entorno.");
      return;
    }

    this.resend = new Resend(key);
  }

  async sendRegisterEmail(email: string, name: string) {
    if (!this.resend) return; // no rompe la app en dev

    await this.resend.emails.send({
      from: "Liveticket <no-reply@liveticket.com>",
      to: email,
      subject: "Bienvenido 🎉",
      html: `<h1>Hola ${name}, bienvenido a Liveticket</h1>`,
    });
  }

  async sendEmail(email: string, text: string) {
    if (!this.resend) return;

    return await this.resend.emails.send({
      from: "Liveticket <no-reply@liveticket.com>",
      to: email,
      subject: "Test email",
      html: `${text}`,
    });
  }
}


