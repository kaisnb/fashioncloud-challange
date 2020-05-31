export class DateFactoryMock {
  now = jest.fn(() => new Date().getTime());
}
