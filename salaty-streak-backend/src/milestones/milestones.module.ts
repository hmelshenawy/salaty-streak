import { Global, Module, forwardRef } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { StreaksModule } from '../streaks/streaks.module';

@Global()
@Module({
  imports: [forwardRef(() => StreaksModule)],
  providers: [MilestonesService],
  exports: [MilestonesService],
})
export class MilestonesModule {}