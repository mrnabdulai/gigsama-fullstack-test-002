/**
 * Generates a URL-friendly slug from a string
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
	return text
	  .toString()
	  .toLowerCase()
	  .trim()
	  .replace(/\s+/g, '-')        // Replace spaces with -
	  .replace(/&/g, '-and-')      // Replace & with 'and'
	  .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
	  .replace(/\-\-+/g, '-')      // Replace multiple - with single -
	  .replace(/^-+/, '')          // Trim - from start of text
	  .replace(/-+$/, '')          // Trim - from end of text
	  + '-' + generateRandomString(8); // Add random suffix for uniqueness
  }
  
  /**
   * Generates a random alphanumeric string of specified length
   * 
   * @param length - The length of the string to generate
   * @returns Random alphanumeric string
   */
  function generateRandomString(length: number): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
	  result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
  }