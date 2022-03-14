import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    JwtModule.register({
      privateKey: process.env.SECRET_KEY,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
