export class FilterCategoryService {
  private categoryFilters: string[] = [
    'Design / UX',
    'SysAdmin / DevOps / QA',
    'Data Science / Analytics',
    'Programming',
    'Mobile Developer',
  ];

  public validateCategory(key: string): boolean {
    const keyClean = key.toLowerCase().replaceAll(' ', '');
    for (let cat = 0; cat < this.categoryFilters.length; cat++) {
      const item = this.categoryFilters[cat].toLowerCase().replaceAll(' ', '');
      if (keyClean.includes(item)) return true;
    }
    return false;
  }
}
