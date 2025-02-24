/**
 * Gets the schema tag split by uppercase letters
 *
 * @param {string} tag
 * @returns {string}
 */
export const getSchemaTag = (tag) => tag.split(/(?=[A-Z])/).join(' ')
