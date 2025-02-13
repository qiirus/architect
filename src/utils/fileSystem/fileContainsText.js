import { readFileSync } from 'node:fs'

/**
 *
 * @param {string} filePath
 * @param {string} text
 * @returns {boolean}
 */
export const fileContainsText = (filePath, text) => {
  const content = readFileSync(filePath, 'utf8')

  return content.includes(text)
}
