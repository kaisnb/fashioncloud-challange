export class ConfigMock {
  get = jest.fn((key: string) => {
    const options = {
      CACHE_SIZE: '4',
      CACHE_ENTRY_TTL: '1000',
    };
    return options[key];
  });
}
