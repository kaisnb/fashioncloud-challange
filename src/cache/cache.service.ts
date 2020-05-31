import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DateFactory, dateFactoryProvider } from '../utils/date-factory';
import { generateRndString } from '../utils/utils';
import { CacheEntry, CacheEntryDoc } from './interfaces/cache-entry.interface';

/**
 * This Cache is implemented using LRU (Least Recently Used) eviction policy. This policy evicts the entry
 * inside the cache which has been read least recently. This is easy to implement for us becasue we already have
 * a expiry property to check if an entry has exceeded its TTL (Time to live). Other common eviction policies are
 * FIFO (First In First Out) and LFU (Least Frequently Used).
 *
 * To maintain the cache size limit and the TTL a vaccuming is performed after every set operation. The vaccuming
 * first deletes all expired entries. After that it checks if the limit is still exceeded. If thats the case the
 * oldest N (Cache Size - Limit) entries are deleted.
 *
 * Since the vaccuming is performed after the set operation, the cache can temporarily have more entries than the
 * limit, but only until the vaccuming is performed. If the vaccuming is performed before the set operation, we can also
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
  private readonly TTL = parseInt(this.configService.get('CACHE_ENTRY_TTL'), 10) || 10000;

  /**
   * @ignore
   */
  constructor(
    private configService: ConfigService,
    @Inject(dateFactoryProvider.provide) private dateFactory: DateFactory,
    @InjectModel('CacheEntry') private model: Model<CacheEntryDoc>,
  ) {}

  /**
   * Returns the cached data for a given key. If the key is not found in
   * the cache a new entry is generated and returned. If the key is found in
   * the cache the expiry is checked. If the entry has reached its TTL, it is
   * override like it the was a cache miss. If the entry is not stale, its
   * expiry is refeshed.
   *
   * Cache entries written by other processes may be overriden since the check
   * if an entry exits and the write of the entry is not an atomic operation.
   *
   * @param key of the cache entry
   */
  async get(key: string): Promise<string> {
    let entry: CacheEntry = await this.model.findOne({ key }).exec();
    if (null === entry) {
      console.log('Cache miss');
      entry = await this.set(key, generateRndString(32));
    } else {
      console.log('Cache hit');
      const now = this.dateFactory.now();
      if (entry.expiry < now) {
        entry = await this.set(key, generateRndString(32), true);
      } else {
        this.model.updateOne({ key }, { expiry: this.getExpiry() }).exec();
      }
    }
    return entry.value;
  }

  /**
   * Returns all entries in the cache but only the given properties. You need
   * to define at least on property.
   *
   * @param properties of the cache entry
   */
  async findAll(properties: string[]): Promise<Partial<CacheEntry>[]> {
    const projection = properties.reduce((prev, cur) => ((prev[cur] = 1), prev), {});
    return this.model.find(null, projection).exec();
  }

  /**
   * Updates or inserts the data for a given key. The response is empty.
   * The optional override param can be used to prevent the vaccuming.
   *
   * @param key of the cache entry
   * @param value of the cache entry
   * @param override true/false if already know that we override and entry
   */
  async set(key: string, value: string, override?: boolean): Promise<CacheEntry> {
    const cacheEntry = { key, value, expiry: this.getExpiry() };
    await this.model.updateOne({ key }, cacheEntry, { upsert: true }).exec();
    // The caller can signal that its only an override if he knows the
    // key exists, so that we can optimize and dont have to vaccum
    if (!override) {
      // The vaccuming is done asynchroneous, we do not need to wait
      // here and can respon fast to the client
      this.vaccum();
    }
    return cacheEntry;
  }

  /**
   * Removes the cache entry for the given key. The response is empty.
   *
   * @param key  of the cache entry
   */
  async remove(key: string): Promise<any> {
    return this.model.deleteOne({ key }).exec();
  }

  /**
   * Removes all cache entries.
   */
  async removeAll(): Promise<any> {
    return this.model.deleteMany({}).exec();
  }

  /**
   * Performs a vaccuming. A vaccuming first deletes all expired entries inside
   * the cache. After that a count query is excuted to check if the cache size
   * exceeds its limits. If thats the case, the oldes N (cache size - limit)
   * entries are delete.
   */
  async vaccum(): Promise<void> {
    const now = this.dateFactory.now();
    await this.model.deleteMany({ expiry: { $lt: now } }).exec();

    const count = await this.model.countDocuments().exec();
    if (count > this.LIMIT) {
      // It would also work correct if we only remove the oldes entry, but to
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
      await this.model.deleteMany({ key: { $in: keys } }).exec();
    }
  }

  /**
   * Calculates the expiry a cache entry has if set right now.
   */
  private getExpiry(): number {
    return this.dateFactory.now() + this.TTL;
  }
}
