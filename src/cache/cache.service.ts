import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheEntry, CacheEntryDoc } from './interfaces/cache-entry.interface';

@Injectable()
export class CacheService {
  constructor(
    @InjectModel('CacheEntry') private cacheEntryModel: Model<CacheEntryDoc>,
  ) {}

  async create(cacheEntry: CacheEntry): Promise<CacheEntryDoc> {
    const createdCat = new this.cacheEntryModel(cacheEntry);
    return await createdCat.save();
  }

  async findAll(): Promise<CacheEntryDoc[]> {
    return this.cacheEntryModel.find().exec();
  }
}
