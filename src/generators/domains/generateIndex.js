import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { createFile } from '../../utils/index.js'

/**
 *
 * @param {string} dirPath
 * @param {string} domain
 */
export const generateIndex = (domainName, domainPath) => {
  const filePath = join(domainPath, 'index.js')

  if (!existsSync(filePath)) {
    const content = [
      `export * from './${domainName}.controller.js'`,
      `export * from './${domainName}.model.js'`,
      `export * from './${domainName}.routes.js'`,
      `export * from './${domainName}.schema.js'`,
      `export * from './${domainName}.validation.js'`,
      ''
    ]

    createFile(filePath, content.join('\n'))
  }
}
