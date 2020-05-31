import { Body, Controller, Delete, Get, HttpCode, Param, ParseArrayPipe, Put, Query } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheEntry } from './interfaces/cache-entry.interface';

/**
 * Endpoint for all requests related to the cache.
 */
@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheService) {}

  /**
   * Returns the cached data for a given key. If the key is not found in
   * the cache a new entry is generated and returned. If the key is found in
   * the cache, the data is returned.
   *
   * @param key of the cache entry
   */
  @Get(':key')
  async get(@Param('key') key: string): Promise<string> {
    return this.cacheService.get(key);
  }

  /**
   * Returns all entries in the cache but only the given properties. You need
   * to define at least on property. Otherwise a 400 Bad Request is returned.
   *
   * @param properties of the cache entry
   */
  @Get()
  async findAll(@Query('properties', ParseArrayPipe) properties: string[]): Promise<Partial<CacheEntry>[]> {
    return this.cacheService.findAll(properties);
  }

  /**
   * Updates or inserts the data for a given key. The response is empty.
   *
   * @param key of the cache entry
   * @param value of the cache entry
   */
  @Put(':key')
  @HttpCode(204)
  async set(@Param('key') key: string, @Body() value: string): Promise<void> {
    await this.cacheService.set(key, value);
  }

  /**
   * Removes the cache entry for the given key. The response is empty.
   *
   * @param key  of the cache entry
   */
  @Delete(':key')
  @HttpCode(204)
  async remove(key: string): Promise<void> {
    await this.cacheService.remove(key);
  }

  /**
   * Removes all cache entries.
   */
  @Delete()
  @HttpCode(204)
  async removeAll(): Promise<void> {
    await this.cacheService.removeAll();
  }
}
