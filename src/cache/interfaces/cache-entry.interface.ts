import { Document } from 'mongoose';

/**
 * Type of a plain CacheEntry.
 */
export interface CacheEntry {
  /**
   * Key of the cache entry
   */
  key: string;
  /**
   * Value to be cached
   */
  value: string;
  /**
   * Expiry in milliseconds
   */
  expiry: number;
}

/**
 * Type auf a CacheEntry used in mongoose context.
 */
export interface CacheEntryDoc extends CacheEntry, Document {}
