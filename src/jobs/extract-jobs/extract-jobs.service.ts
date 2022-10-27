import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpJobsService } from 'src/utility/http-jobs/http-jobs.service';
import { Repository } from 'typeorm';
import { Jobs } from '../../typeorm/jobs.entity';
import { FilterCategoryService } from '../../utility/filter-category/filter-category.service';

@Injectable()
export class ExtractJobsService {
  private readonly logger = new Logger(ExtractJobsService.name);
  private readonly _loadhttp: HttpJobsService = new HttpJobsService();
  private readonly _filterCat: FilterCategoryService =
    new FilterCategoryService();
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
  @Cron(`*/${Number(process.env.MIN_CRON_EXTRACT)}  * * * *`)
  async handleCron() {
    try {
      this.logger.log('[ExtractJobsService]Start');
      const dataJobs = await this._loadhttp.loadJobs();
      const mapData = dataJobs.map((item) => {
        return this.mapJob(item);
      });
      const filterData = mapData.filter((item) => {
        return this._filterCat.validateCategory(item.category);
      });
      await this.jobsRepository
        .createQueryBuilder()
        .insert()
        .into(Jobs)
        .values(filterData)
        .orUpdate({
          conflict_target: ['id_job'],
          overwrite: [
            'title',
            'description',
            'category',
            'linkjob',
            'functions',
          ],
        })
        .execute();
      this.logger.log('[ExtractJobsService]End');
    } catch (error) {
      this.logger.error('[ExtractJobsService]:', error);
    }
  }
}
