import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheController } from './cache.controller';
import { CacheService } from './cache.service';
import { CacheEntrySchema } from './schemas/cache-entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CacheEntry', schema: CacheEntrySchema },
    ]),
  ],
  controllers: [CacheController],
  providers: [CacheService],
})
export class CacheModule {}
