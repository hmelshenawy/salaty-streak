import { Controller, Get, Put, Param, Body, Request } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { MilestonesService } from '../milestones/milestones.service';
import { SetRewardDto } from './dto/set-reward.dto';

@Controller('streaks')
export class StreaksController {
  constructor(
    private readonly streaksService: StreaksService,
    private readonly milestonesService: MilestonesService,
  ) {}

  @Get('current')
  async getCurrentStreak(@Request() req: { user: { sub: string } }) {
    return this.streaksService.calculateStreaks(req.user.sub);
  }

  @Get('milestones')
  async getMilestones(@Request() req: { user: { sub: string } }) {
    return this.milestonesService.getMilestones(req.user.sub);
  }

  @Get('next')
  async getNextMilestone(@Request() req: { user: { sub: string } }) {
    return this.milestonesService.getNextMilestone(req.user.sub);
  }

  @Get('unviewed')
  async getUnviewedMilestones(@Request() req: { user: { sub: string } }) {
    return this.milestonesService.getUnviewedMilestones(req.user.sub);
  }

  @Put('milestones/:milestoneId/view')
  async markViewed(
    @Request() req: { user: { sub: string } },
    @Param('milestoneId') milestoneId: string,
  ) {
    return this.milestonesService.markViewed(req.user.sub, milestoneId);
  }

  @Put('milestones/:milestoneId/reward')
  async setReward(
    @Request() req: { user: { sub: string } },
    @Param('milestoneId') milestoneId: string,
    @Body() dto: SetRewardDto,
  ) {
    return this.milestonesService.setReward(req.user.sub, milestoneId, dto.reward);
  }
}