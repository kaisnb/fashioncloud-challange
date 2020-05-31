import { DocumentQueryMock } from './document-query.mock';

export class ModelMock<T> {
  find: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => new DocumentQueryMock(null));
  findOne: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => new DocumentQueryMock(null));
  updateOne: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => new DocumentQueryMock(null));
  deleteOne: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => new DocumentQueryMock(null));
  deleteMany: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => new DocumentQueryMock(null));
  countDocuments: jest.Mock<DocumentQueryMock<T>> = jest.fn(() => new DocumentQueryMock(null));
}
