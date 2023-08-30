import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
@Controller('tags')
export class TagController {
  constructor(private readonly tagservice: TagService) {}
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagservice.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
