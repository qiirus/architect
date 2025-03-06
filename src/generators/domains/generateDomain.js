import { join } from 'node:path'

import {
  generateController,
  generateFixtures,
  generateIndex,
  generateIntegrationTest,
  generateModel,
  generateRoutes,
  generateSchema,
  generateStubs,
  generateValidations
} from './index.js'
import { createDirectory } from '../../utils/index.js'
import { colorize, GREEN } from '../../utils/colorize.js'

/**
 *
 * @param {string} domainPath
 * @returns {void}
 */
export const generateDomain = (domainName, currentPath) => {
  // const domainName = basename(domainName)
  const domainPath = join(currentPath, 'src/domains', domainName)

  createDirectory(domainPath)

  generateIndex(domainName, domainPath)
  generateController(domainName, domainPath)
  generateModel(domainName, domainPath)
  generateRoutes(domainName, domainPath)
  generateSchema(domainName, domainPath)
  generateValidations(domainName, domainPath)

  // Integration Test logic
  generateStubs(currentPath)
  generateFixtures(domainName, currentPath)
  generateIntegrationTest(domainName, currentPath)

  console.log(colorize(`All files generated successfully in ${domainName}.`, GREEN))
}
