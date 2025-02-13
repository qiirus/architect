import { existsSync, writeFileSync } from 'node:fs'

import { colorize, GREEN, YELLOW } from '../colorize.js'

/**
 *
 * @param {string} filePath
 * @returns {boolean}
 */
export const createFile = (filePath) => {
  if (existsSync(filePath)) {
    console.log(colorize(`File '${filePath}' already exists. Skipping.`, YELLOW))

    return false
  }

  writeFileSync(filePath, '')

  console.log(colorize(`File '${filePath}' created.`, GREEN))

  return true
}
