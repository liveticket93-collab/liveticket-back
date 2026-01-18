import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailController } from "./email.controller";
import { ConfigModule } from "@nestjs/config";
import { mailerConfig } from "src/config/nodemail";

@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
