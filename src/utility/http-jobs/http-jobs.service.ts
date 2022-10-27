import { Logger } from '@nestjs/common';
import { Job } from './jobs.interface';

export class HttpJobsService {
  private readonly logger = new Logger(HttpJobsService.name);

  public async loadJobs() {
    try {
      this.logger.log('[loadJobs]Start');
      const urlData = (page: number) =>
        `${process.env.PATH_JOBS}/search/jobs?per_page=${process.env.ITEM_SIZE_JOBS}&page=${page}&expand=["company"]&remote=true`;
      const pagesize = Number(process.env.PAGE_SIZE_JOBS);
      const dataJobs = [];
      for (let i = 0; i < pagesize; i++) {
        const url = urlData(i + 1);
        this.logger.log('[loadJobs]url:', url);
        const response = await fetch(url).then((response) => response.json());
        if (response && response.data) {
          dataJobs.push(...response.data);
        }
      }
      this.logger.log('[loadJobs]End');
      return dataJobs;
    } catch (error) {
      this.logger.error('[loadJobs]:', error);
      return [];
    }
  }
  public async sendJobDiscord(jobs: Job[]) {
    try {
      this.logger.log('[sendJobDiscord]Start');
      const urlData = `${process.env.PATH_WEBHOOK_DISCORD}`;
      const bodyData = {
        content: 'Hola soy **MANJOB** y les estare mandando pegues **EXITOS**',
        tts: false,
        embeds: jobs.map((item: Job) => {
          return {
            title: item.title,
            description: `
            Categoria: ${item.category}
            Link: ${item.linkjob}
            `,
          };
        }),
      };
      await fetch(urlData, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(bodyData),
      });
      this.logger.log('[sendJobDiscord]End');
      return true;
    } catch (error) {
      this.logger.error('[sendJobDiscord]:', error);
      return false;
    }
  }
}
