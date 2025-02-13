import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { createFile } from '../../utils/index.js'

/**
 *
 * @param {string} dirPath
 * @param {string} domain
 */
export const generateIndex = (dirPath, domain) => {
  const indexPath = join(dirPath, 'index.js')

  createFile(indexPath)

  if (existsSync(indexPath)) {
    const content = [
      `export * from './${domain}.controller.js'`,
      `export * from './${domain}.model.js'`,
      `export * from './${domain}.routes.js'`,
      `export * from './${domain}.schema.js'`,
      `export * from './${domain}.validation.js'`,
      ''
    ]

    writeFileSync(indexPath, content.join('\n'))
  }
}
