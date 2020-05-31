import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseArrayPipe,
  Put,
  Query,
} from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheEntry, CacheEntryKey } from './interfaces/cache-entry.interface';

@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  @Get(':key')
  async get(@Param('key') key: string): Promise<CacheEntry> {
    return this.cacheService.get(key);
  }

  @Get()
  async findAll(
    @Query('properties', ParseArrayPipe) properties: string[],
  ): Promise<CacheEntryKey[]> {
    return this.cacheService.findAll(properties);
  }

  @Put()
  @HttpCode(204)
  async set(cacheEntry: CacheEntry): Promise<void> {
    await this.cacheService.set(cacheEntry);
  }
}
