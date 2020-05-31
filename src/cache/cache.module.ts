import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { CacheEntrySchema } from './schemas/cache-entry.schema';
import { dateFactoryProvider } from '../utils/date-factory';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'CacheEntry', schema: CacheEntrySchema }])],
  controllers: [CacheController],
  providers: [CacheService, dateFactoryProvider],
})
export class CacheModule {}
