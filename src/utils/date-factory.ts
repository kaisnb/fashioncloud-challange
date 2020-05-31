/**
 * Typedefintion for the DateFactory
 */
export interface DateFactory {
  /**
   * Returns the current UTC time in milliseconds
   */
  now: () => number;
}

/**
 * For easier mocking inside tests we inject a factory instead
 * of using Date constructor.
 */
export const dateFactoryProvider = {
  provide: 'DATE_FACTORY',
  useValue: {
    now: () => new Date().getTime(),
  },
};
