import { Document } from 'mongoose';

export interface CacheEntryKey {
  key: string;
}

export interface CacheEntry extends CacheEntryKey {
  value: string;
  expiry: number;
}

export interface CacheEntryDoc extends CacheEntry, Document {}
