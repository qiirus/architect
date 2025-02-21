import { unzip } from 'unzipit'

/** @typedef {import('unzipit').ZipEntry} ZipEntry */
/** @typedef {Record<string, ZipEntry>} ZipEntries */

/**
 * @param {string} url
 * @returns {ZipEntries}}
 * @throws {Error}
 */
export const downloadFramework = async (url) => {
  const { entries } = await unzip(url)

  return entries
}
