import { Controller, Get, Param, Post, Query } from "@nestjs/common";
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

  @Get("successPurchase")
  send_success(@Query("email") email: string) {
    return this.emailService.sendPurchaseEmail(
      email,
      Math.floor(1000000000 + Math.random() * 9000000000).toString()
    );
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
