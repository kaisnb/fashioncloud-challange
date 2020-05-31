import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CacheEntry,
  CacheEntryDoc,
  CacheEntryKey,
} from './interfaces/cache-entry.interface';

@Injectable()
export class CacheService {
  /**
   * The maximum number of entries the cache can hold.
   */
  private readonly LIMIT =
    parseInt(this.configService.get('CACHE_SIZE'), 10) || 100000;

  /**
   * The maximum time in ms a cache entry lives.
   */
  private readonly TTL =
    parseInt(this.configService.get('CACHE_ENTR_TTL'), 10) || 10000;

  constructor(
    private configService: ConfigService,
    @InjectModel('CacheEntry') private model: Model<CacheEntryDoc>,
  ) {}

  async get(key: string): Promise<CacheEntry> {
    let entry: CacheEntry = await this.model.findOne({ key });
    if (null === entry) {
      console.log('Cache miss');
      entry = await this.set(key, this.generateRndString(32));
    } else {
      console.log('Cache hit');
      const now = new Date().getTime();
      if (entry.expiry < now) {
        entry = await this.set(key, this.generateRndString(32));
      } else {
        this.model.updateOne({ key }, { expiry: this.getExpiry() });
      }
    }
    return entry;
  }

  async findAll(properties: string[]): Promise<CacheEntryKey[]> {
    const projection = properties.reduce(
      (prev, cur) => ((prev[cur] = 1), prev),
      {},
    );
    return this.model.find(null, projection).exec();
  }

  async set(key: string, value: string): Promise<CacheEntry> {
    const cacheEntry = { key, value, expiry: this.getExpiry() };
    await this.model.updateOne({ key }, cacheEntry, { upsert: true });
    return cacheEntry;
  }

  async remove(key: string) {
    return this.model.deleteOne({ key });
  }

  private getExpiry(): number {
    return new Date().getTime() + this.TTL;
  }

  private generateRndString(length: number) {
    let result = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charCount = chars.length;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charCount));
    }
    return result;
  }
}
