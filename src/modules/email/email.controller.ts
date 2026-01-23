import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "./sendgrid.service";

@ApiTags("Email Sending")
@Controller("email")
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private config: ConfigService
  ) {}

  @ApiOperation({
    summary:
      "Es unicamente una ruta de TEST, ingresa tu email y un mensaje y recibiras automáticamente un email",
  })
  @Get("test")
  send_email(@Query("email") email: string, @Query("message") message: string) {
    return this.emailService.sendEmail(email, message);
  }

  /*
  @ApiOperation({
    summary:
      "Es unicamente una ruta de TEST, ingresa tu email y un mensaje y recibiras automáticamente un email (SendGrid)",
  })
  @Get("test-sendGrid")
  sendGrid_email(
    @Query("email") email: string,
    @Query("message") message: string
  ) {
    return this.sendGridService.sendEmail(email, "Saludos", message);
  }*/
}
