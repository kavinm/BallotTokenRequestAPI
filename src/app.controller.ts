import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDto } from './types/RequestTokens.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('request-tokens')
  @ApiBody({ type: RequestTokensDto })
  requestTokens(@Body() body: RequestTokensDto) {
    return this.appService.requestTokens(body.address, body.signature);
  }
}
