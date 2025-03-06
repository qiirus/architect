import { dirname, join } from 'node:path'
import { appendFileSync, existsSync } from 'node:fs'

import { camelCase, kebabCase, pascalCase } from '@devnetic/utils'
import pluralize from 'pluralize'

import { createFile, getSchemaTag } from '../../utils/index.js'

/**
 *
 * @param {string} dirPath
 * @param {string} domain
 * @returns {void}
 */
export const generateRoutes = (domainName, domainPath) => {
  const filePath = join(domainPath, `${domainName}.routes.js`)
  const tagName = getSchemaTag(pascalCase(pluralize.singular(domainName)))
  const endpointName = kebabCase(domainName)

  if (!existsSync(filePath)) {
    const content = [
      `import { controller } from './${domainName}.controller.js'`,
      `import { validations } from './${domainName}.validation.js'`,
      '',
      `export const ${camelCase(domainName)}Routes = async (app) => {`,
      '  app.post(',
      `    '/${endpointName}',`,
      `    { schema: { ...validations.create, tags: ['${tagName}'] } },`,
      '    controller.create',
      '  )',
      '',
      '  app.get(',
      `    '/${endpointName}',`,
      `    { schema: { ...validations.getAll, tags: ['${tagName}'] } },`,
      '    controller.getAll',
      '  )',
      '',
      '  app.get(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.getById, tags: ['${tagName}'] } },`,
      '    controller.getById',
      '  )',
      '',
      '  app.delete(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.delete, tags: ['${tagName}'] } },`,
      '    controller.deleteById',
      '  )',
      '',
      '  app.patch(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.patch, tags: ['${tagName}'] } },`,
      '    controller.patch',
      '  )',
      '',
      '  app.put(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.put, tags: ['${tagName}'] } },`,
      '    controller.update',
      '  )',
      '}',
      ''
    ]

    createFile(filePath, content.join('\n'))

    const routesFilename = join(dirname(domainPath), 'routes.js')
    const routesPath = join(`${domainName}`, `${domainName}.routes.js`)

    appendFileSync(routesFilename, `export * from './${routesPath}'\n`)
  }
}
