import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { JwtStrategy } from "src/jwt/jwt-strategy";
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }