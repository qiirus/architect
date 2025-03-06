import { existsSync, writeFileSync } from 'node:fs'

import { colorize, CYAN, YELLOW } from '../colorize.js'

/**
 *
 * @param {string} filePath
 * @param {boolean} [silence=false]
 * @returns {boolean}
 */
export const createFile = (filePath, content, silence = false) => {
  if (existsSync(filePath)) {
    if (silence === false) {
      console.log(colorize(`File '${filePath}' already exists. Skipping.`, YELLOW))
    }

    return false
  }

  writeFileSync(filePath, content)

  if (silence === false) {
    console.log(colorize(`File '${filePath}' created.`, CYAN))
  }

  return true
}
