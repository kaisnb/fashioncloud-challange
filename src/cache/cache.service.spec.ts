import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '../../test/mocks/config.mock';
import { DateFactoryMock } from '../../test/mocks/date-factory.mock';
import { DocumentQueryMock } from '../../test/mocks/document-query.mock';
import { ModelMock } from '../../test/mocks/model.mock';
import { dateFactoryProvider } from '../utils/date-factory';
import { CacheService } from './cache.service';
import { CacheEntryDoc } from './interfaces/cache-entry.interface';

describe('CacheService', () => {
  let service: CacheService;
  let dateFactory: DateFactoryMock;
  let config: ConfigMock;
  let model: ModelMock<CacheEntryDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: dateFactoryProvider.provide, useClass: DateFactoryMock },
        { provide: ConfigService, useClass: ConfigMock },
        { provide: getModelToken('CacheEntry'), useClass: ModelMock },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    dateFactory = module.get<DateFactoryMock>(dateFactoryProvider.provide);
    config = module.get<ConfigMock>(ConfigService as any);
    model = module.get<ModelMock<CacheEntryDoc>>(getModelToken('CacheEntry'));

    // silent logging until we inject a logger service
    // which can be mocked here
    console.log = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    const key = 'key1';

    beforeEach(() => {
      service.set = jest.fn();
    });

    it('should create entry on cache miss', async () => {
      model.findOne.mockReturnValueOnce(new DocumentQueryMock<CacheEntryDoc>(null));

      await service.get(key);

      expect(service.set).toBeCalledTimes(1);
      expect(service.set).toBeCalledWith(key, expect.any(String));
    });

    it('should create entry if expired', async () => {
      model.findOne.mockReturnValueOnce(
        new DocumentQueryMock<CacheEntryDoc>({ expiry: 0 }),
      );

      await service.get(key);

      expect(service.set).toBeCalledTimes(1);
      expect(service.set).toBeCalledWith(key, expect.any(String), true);
    });

    it('should update expiry on cache hit', async () => {
      const now = new Date().getTime();
      const expiry = now + parseInt(config.get('CACHE_ENTRY_TTL'), 10);
      dateFactory.now.mockReturnValue(now);
      model.findOne.mockReturnValueOnce(
        new DocumentQueryMock<CacheEntryDoc>({ expiry: Number.MAX_SAFE_INTEGER }),
      );

      await service.get(key);

      expect(model.updateOne).toBeCalledTimes(1);
      expect(model.updateOne).toBeCalledWith({ key }, { expiry });
    });
  });

  describe('findAll', () => {
    it('should create projection argument', async () => {
      await service.findAll(['prop1', 'prop2']);

      expect(model.find).toBeCalledTimes(1);
      expect(model.find).toBeCalledWith(null, { prop1: 1, prop2: 1 });
    });
  });

  describe('set', () => {
    const key = 'key1';
    const value = 'value1';

    it('should use upsert', async () => {
      await service.set(key, value);
      expect(model.updateOne).toBeCalledWith({ key }, expect.anything(), { upsert: true });
    });

    it('should run the vaccuming', async () => {
      service.vaccum = jest.fn();
      await service.set(key, value);
      expect(service.vaccum).toBeCalledTimes(1);
    });
  });

  describe('vaccum', () => {
    it('remove n oldest entries if limit exceeded', async () => {
      const now = new Date().getTime();
      dateFactory.now.mockReturnValue(now);
      model.countDocuments.mockReturnValueOnce(new DocumentQueryMock<CacheEntryDoc>(7));
      model.find.mockReturnValueOnce(new DocumentQueryMock([{ key: 'key1' }, { key: 'key2' }]));

      await service.vaccum();

      expect(model.deleteMany).toBeCalledWith({ key: { $in: ['key1', 'key2'] } });
    });

    it('should not cleanup if limit is not exceeded', async () => {
      model.countDocuments.mockReturnValueOnce(new DocumentQueryMock<CacheEntryDoc>(3));

      await service.vaccum();

      expect(model.find).not.toBeCalled();
      expect(model.deleteMany).toBeCalledTimes(1);
    });
  });
});
