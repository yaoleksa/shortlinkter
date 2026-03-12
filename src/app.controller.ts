import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  Param,
  Redirect,
  Req,
  HttpCode
} from '@nestjs/common';
import type { CreateLinkDTO } from './pipes/inputDTO/input.DTO';
import { createUrlSchema } from './pipes/inputDTO/input.DTO';
import { ValidateUrl } from './pipes/url.pipe';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post()
  @UsePipes(new ValidateUrl(createUrlSchema))
  async postUrl(@Req() rq: Request, @Body() createLinkDTO: CreateLinkDTO) {
    return `${rq.protocol}://${rq.host}/${(await (await this.appService.handleAndPostLongLink(createLinkDTO.link)).text())}`;
  }
  @Get()
  @Redirect('https://yaoleksa.github.io/shortlinkter/', 302)
  indexHtml() {}
  @Get(':id')
  @HttpCode(302)
  @Redirect()
  async redirect(@Param('id') id: string) {
    return {
      url: await ((await this.appService.getHyperlinkById(id)).text())
    };
  }
}
