import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { ConfigModule } from "@nestjs/config";
import { mailerConfig } from "src/config/nodemail";
import { EmailService } from "./sendgrid.service";

@Module({
  // imports: [ConfigModule.forFeature(mailerConfig)],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
