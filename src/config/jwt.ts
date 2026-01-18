import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: ".env" });

const config = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: "1d",
  },
};

export const jwtConfig = registerAs("jwt_config", () => config);
