import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheEntry } from './interfaces/cache-entry.interface';

@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  @Get(':key')
  async get(@Param('key') key: string) {
    return this.cacheService.get(key);
  }

  @Get('keys/all')
  async findAllKeys() {
    return this.cacheService.findAllKeys();
  }

  @Put()
  async set(cacheEntry: CacheEntry) {
    return this.cacheService.set(cacheEntry);
  }

  @Post()
  async create(cacheEntry: CacheEntry) {
    return this.cacheService.set(cacheEntry);
  }
}
