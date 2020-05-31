import { Controller, Get, Post } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheEntry } from './interfaces/cache-entry.interface';

@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  @Post()
  async create(cacheEntry: CacheEntry) {
    return this.cacheService.create(cacheEntry);
  }

  @Get()
  async findAll() {
    return this.cacheService.findAll();
  }
}
