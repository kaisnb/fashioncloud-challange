/**
 * Generates a random string using letters from A-Z lower and uppercase
 * and numbers.
 *
 * @param length of the string to be generated
 */
export function generateRndString(length: number) {
  let result = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charCount = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charCount));
  }
  return result;
}
