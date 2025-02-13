// ANSI escape codes for colors
export const CYAN = '\x1b[36m'
export const GREEN = '\x1b[32m'
export const RESET = '\x1b[0m' // Reset color
export const RED = '\x1b[31m'
export const YELLOW = '\x1b[33m'

/**
 * Utility function to colorize text
 *
 * @param {string} text
 * @param {string} color
 * @returns {string}
 */
export const colorize = (text, color) => {
  return `${color}${text}${RESET}`
}
