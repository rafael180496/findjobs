import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from '../typeorm/jobs.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ExtractJobsService } from './extract-jobs/extract-jobs.service';
import { SendJobsService } from './send-jobs/send-jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Jobs]), ScheduleModule.forRoot()],
  providers: [ExtractJobsService, SendJobsService],
})
export class JobsModule {}
