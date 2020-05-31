import * as mongoose from 'mongoose';

export const CacheEntrySchema = new mongoose.Schema({
  key: String,
  value: String,
  expiry: Number,
});

// remove ensureInde deprecation warning https://stackoverflow.com/questions/51960171
mongoose.set('useCreateIndex', true);

// add an unique index to our cache key only needed during development
CacheEntrySchema.index({ key: 1 }, { unique: true });
