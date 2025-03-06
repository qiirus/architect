import { existsSync, mkdirSync } from 'node:fs'

import { colorize, GREEN, YELLOW } from '../colorize.js'

/**
 *
 * @param {string} dirPath
 * @param {boolean} [silence=false]
 * @returns {boolean}
 */
export const createDirectory = (dirPath, silence = false) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })

    if (silence === false) {
      console.log(colorize(`Directory '${dirPath}' created.`, GREEN))
    }

    return true
  } else {
    if (silence === false) {
      console.log(colorize(`Directory '${dirPath}' already exists.`, YELLOW))
    }

    return false
  }
}
