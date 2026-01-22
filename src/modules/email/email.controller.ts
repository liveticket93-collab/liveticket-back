import { Controller, Get, Param, Query } from "@nestjs/common";
import { EmailService } from "./email.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { ResendService } from "./resend.service";

@ApiTags("Email Sending")
@Controller("email")
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly resenderService: ResendService,
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

  @ApiOperation({
    summary:
      "Es unicamente una ruta de TEST, ingresa tu email y un mensaje y recibiras automáticamente un email (Resender)",
  })
  @Get("test_resender")
  send_email_resender(
    @Query("email") email: string,
    @Query("message") message: string
  ) {
    return this.resenderService.sendEmail(email, message);
  }
}
