/**
 * Creates a regex from an array of numbers
 */
export declare const regexFromNumberArray: (array: number[]) => string;
/**
 * Replace any part of a regex containing ORs with just digits like [a-Z]hello(123|456|32) or a(3|5|6)
 *
 * WARNING The list of numbers must be contained in parenthesis or representing the entire string
 */
export declare const simplifyExistingRegex: (regex: string) => string;
