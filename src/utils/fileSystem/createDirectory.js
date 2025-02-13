import { existsSync, mkdirSync } from 'node:fs'

import { colorize, GREEN, YELLOW } from '../colorize.js'

/**
 *
 * @param {string} dirPath
 * @returns {boolean}
 */
export const createDirectory = (dirPath) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    console.log(colorize(`Directory '${dirPath}' created.`, GREEN))

    return true
  } else {
    console.log(colorize(`Directory '${dirPath}' already exists.`, YELLOW))

    return false
  }
}
