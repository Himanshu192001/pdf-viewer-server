import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {User , UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfMakerService } from './pdf-maker/pdf-maker.service';

@Module({
    imports : [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, PdfMakerService]
})
export class UserModule {}
