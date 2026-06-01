import { Global, Module } from '@nestjs/common';
import { DailySummaryService } from './daily-summary.service';

@Global()
@Module({
  providers: [DailySummaryService],
  exports: [DailySummaryService],
})
export class DailySummaryModule {}