import { basename } from 'node:path'

import {
  generateController,
  generateIndex,
  generateModel,
  generateRoutes,
  generateSchema,
  generateValidations
} from './index.js'
import { createDirectory } from '../../utils/index.js'
import { colorize, GREEN } from '../../utils/colorize.js'

/**
 *
 * @param {string} domainPath
 * @returns {void}
 */
export const generateDomain = (domainPath) => {
  const domainName = basename(domainPath)

  createDirectory(domainPath)

  generateIndex(domainPath, domainName)
  generateController(domainPath, domainName)
  generateModel(domainPath, domainName)
  generateRoutes(domainPath, domainName)
  generateSchema(domainPath, domainName)
  generateValidations(domainPath, domainName)

  console.log(colorize(`All files generated successfully in ${domainPath}.`, GREEN))
}
