import { ModelMock } from './model.mock';

export class DocumentQueryMock<T> extends ModelMock<T> {
  private data: any;
  constructor(data?: any) {
    super();
    this.data = data;
  }
  select: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => this);
  sort: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => this);
  limit: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => this);
  exec: jest.Mock<Promise<any>> = jest.fn(() => Promise.resolve(this.data));
}
