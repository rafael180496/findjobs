import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from '../../typeorm/jobs.entity';
import { Repository } from 'typeorm';
import { HttpJobsService } from '../../utility/http-jobs/http-jobs.service';
import { Cron } from '@nestjs/schedule';
import { Job } from '../../utility/http-jobs/jobs.interface';

@Injectable()
export class SendJobsService {
  private readonly logger = new Logger(SendJobsService.name);
  private readonly _loadhttp: HttpJobsService = new HttpJobsService();

  constructor(
    @InjectRepository(Jobs)
    private jobsRepository: Repository<Jobs>,
  ) {}
  mapJob(item: any) {
    const { id, attributes, links } = item;
    return {
      id: id || '',
      title: attributes.title || '',
      description: attributes.description || '',
      category: attributes.category_name || '',
      linkjob: links.public_url || '',
      functions: attributes.functions || '',
    };
  }
  mapJobSend(item: any): Job {
    return {
      id: item.Jobs_id_job,
      description: item.Jobs_description,
      category: item.Jobs_category,
      created: item.Jobs_created,
      functions: item.Jobs_functions,
      linkjob: item.Jobs_linkjob,
      sendjob: item.Jobs_sendjob,
      title: item.Jobs_title,
    };
  }
  @Cron(`*/${Number(process.env.MIN_CRON_SEND)}  * * * *`)
  async handleCron() {
    try {
      this.logger.log('[SendJobsService]Start');
      const dataJobs =
        (await this.jobsRepository
          .createQueryBuilder()
          .where('sendjob = :condition', { condition: false })
          .orderBy('created', 'DESC')
          .take(Number(process.env.ITEM_SIZE_JOBS_SEND))
          .execute()) || [];
      if (dataJobs && dataJobs.length > 0) {
        const dataMap: Job[] = dataJobs.map((item: any) => {
          return this.mapJobSend(item);
        });
        const idMap = dataJobs.map((item: any) => {
          return item.Jobs_id_job;
        });
        const resp = await this._loadhttp.sendJobDiscord(dataMap);
        if (resp) {
          await this.jobsRepository
            .createQueryBuilder()
            .update(Jobs)
            .set({ sendjob: true })
            .where('id IN (:...ids)', { ids: idMap })
            .execute();
        }
      }

      this.logger.log('[SendJobsService]End');
    } catch (error) {
      this.logger.error('[SendJobsService]:', error);
    }
  }
}
