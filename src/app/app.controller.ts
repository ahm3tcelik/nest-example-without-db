import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../modules/auth/jwt/jwt-guard';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/secret')
  @UseGuards(JwtGuard)
  getMe() {
    return { succes: true };
  }
}
