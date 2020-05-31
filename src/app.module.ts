import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://developer:VBg5vSmFitW4QC8O@cluster0-puo7u.mongodb.net/fashion-cloud-challange?retryWrites=true&w=majority',
    ),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
