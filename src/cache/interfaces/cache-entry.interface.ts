import { Document } from 'mongoose';

export interface CacheEntry {
  key: string;
  value: string;
  expiry: number;
}

export interface CacheEntryDoc extends CacheEntry, Document {}
