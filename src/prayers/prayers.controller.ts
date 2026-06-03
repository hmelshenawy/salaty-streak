import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { CreatePrayerLogDto } from './dto/create-prayer-log.dto';
import { UpdatePrayerLogDto } from './dto/update-prayer-log.dto';

@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Post()
  create(
    @Request() req: { user: { sub: string } },
    @Body() createPrayerLogDto: CreatePrayerLogDto,
  ) {
    return this.prayersService.create(req.user.sub, createPrayerLogDto);
  }

  @Get('today')
  getToday(@Request() req: { user: { sub: string } }) {
    return this.prayersService.getToday(req.user.sub);
  }

  @Get('history')
  getHistory(
    @Request() req: { user: { sub: string } },
    @Query('month') month?: string,
  ) {
    return this.prayersService.getHistory(req.user.sub, month);
  }

  @Put(':id')
  update(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() updatePrayerLogDto: UpdatePrayerLogDto,
  ) {
    return this.prayersService.update(req.user.sub, id, updatePrayerLogDto);
  }

  @Delete(':id')
  remove(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
  ) {
    return this.prayersService.remove(req.user.sub, id);
  }
}