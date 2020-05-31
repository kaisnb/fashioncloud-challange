import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateRndString } from 'src/utils/utils';
import { CacheEntry, CacheEntryDoc, CacheEntryKey } from './interfaces/cache-entry.interface';

/**
 * This Cache is implemented using LRU (Least Recently Used) eviction policy. This policy evicts the entry
 * inside the cache which has been read least recently. This is easy to implement for us becasue we already have
 * a expiry property to check if an entry has exceeded its TTL (Time to live). Other common eviction policies are
 * FIFO (First In First Out) and LFU (Least Frequently Used).
 *
 * To maintain the cache size limit and the TTL a vaccuming is performed after every set operation. The vaccuming
 * first deletes all expired entries. After that its checked if the limit is still exceeded. If thats the case the
 * oldest N (Cache Size - Limit) entries are deleted.
 *
 * Since the vaccuming is performed after the set operation, the cache can temporarily have more entries than the
 * limit, but only until the vaccuming is performed. If the perfom the vaccuming before the set operation, we can also
 * exceed the limit temporarily due to race conditions.
 */
@Injectable()
export class CacheService {
  /**
   * The maximum number of entries the cache can hold.
   */
  private readonly LIMIT = parseInt(this.configService.get('CACHE_SIZE'), 10) || 100000;

  /**
   * The maximum time in ms a cache entry lives.
   */
  private readonly TTL = parseInt(this.configService.get('CACHE_ENTR_TTL'), 10) || 10000;

  constructor(private configService: ConfigService, @InjectModel('CacheEntry') private model: Model<CacheEntryDoc>) {}

  async get(key: string): Promise<CacheEntry> {
    let entry: CacheEntry = await this.model.findOne({ key });
    if (null === entry) {
      console.log('Cache miss');
      entry = await this.set(key, generateRndString(32));
    } else {
      console.log('Cache hit');
      const now = new Date().getTime();
      if (entry.expiry < now) {
        entry = await this.set(key, generateRndString(32), true);
      } else {
        this.model.updateOne({ key }, { expiry: this.getExpiry() });
      }
    }
    return entry;
  }

  async findAll(properties: string[]): Promise<CacheEntryKey[]> {
    const projection = properties.reduce((prev, cur) => ((prev[cur] = 1), prev), {});
    return this.model.find(null, projection).exec();
  }

  async set(key: string, value: string, override?: boolean): Promise<CacheEntry> {
    const cacheEntry = { key, value, expiry: this.getExpiry() };
    await this.model.updateOne({ key }, cacheEntry, { upsert: true });
    // The caller can signal that its only an override if he knows the
    // key exists, so that we can optimize and dont have to count
    if (!override) {
      // The vaccuming is done asynchroneous, we do not need to wait
      // here and can respon fast to the client
      this.vaccum();
    }
    return cacheEntry;
  }

  async remove(key: string): Promise<any> {
    return this.model.deleteOne({ key }).exec();
  }

  async removeAll(): Promise<any> {
    return this.model.deleteMany({}).exec();
  }

  private async vaccum(): Promise<void> {
    const now = new Date().getTime();
    await this.model.deleteMany({ expiry: { $lt: now } }).exec();

    const count = await this.model.countDocuments().exec();
    if (count > this.LIMIT) {
      // It would also be correct to only remove the oldest entry, but to
      // be save we check if there is more then one entry exceeding the limit
      // and delete all of them.
      const exceedingCount = count - this.LIMIT;
      const results = await this.model
        .find()
        .select('key')
        .sort('expiry')
        .limit(exceedingCount)
        .exec();
      const keys = results.map(entry => entry.key);
      await this.model.deleteMany({ key: { $in: keys } });
    }
  }

  private getExpiry(): number {
    return new Date().getTime() + this.TTL;
  }
}
