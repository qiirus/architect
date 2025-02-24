import { dirname, join } from 'node:path'
import { appendFileSync, existsSync, writeFileSync } from 'node:fs'

import { camelCase, kebabCase, pascalCase } from '@devnetic/utils'
import pluralize from 'pluralize'

import { createFile, getSchemaTag } from '../../utils/index.js'

/**
 *
 * @param {string} dirPath
 * @param {string} domain
 * @returns {void}
 */
export const generateRoutes = (dirPath, domain) => {
  const filename = join(dirPath, `${domain}.routes.js`)
  const schemaName = getSchemaTag(pascalCase(pluralize.singular(domain)))
  const endpointName = kebabCase(domain)

  createFile(filename)

  if (existsSync(filename)) {
    const content = [
      `import { controller } from './${domain}.controller.js'`,
      `import { validations } from './${domain}.validation.js'`,
      '',
      `export const ${camelCase(domain)}Routes = async (app) => {`,
      '  app.post(',
      `    '/${endpointName}',`,
      `    { schema: { ...validations.create, tags: ['${schemaName}'] } },`,
      '    controller.create',
      '  )',
      '',
      '  app.get(',
      `    '/${endpointName}',`,
      `    { schema: { ...validations.getAll, tags: ['${schemaName}'] } },`,
      '    controller.getAll',
      '  )',
      '',
      '  app.get(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.getById, tags: ['${schemaName}'] } },`,
      '    controller.getById',
      '  )',
      '',
      '  app.delete(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.delete, tags: ['${schemaName}'] } },`,
      '    controller.deleteById',
      '  )',
      '',
      '  app.patch(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.patch, tags: ['${schemaName}'] } },`,
      '    controller.patch',
      '  )',
      '',
      '  app.put(',
      `    '/${endpointName}/:id',`,
      `    { schema: { ...validations.put, tags: ['${schemaName}'] } },`,
      '    controller.update',
      '  )',
      '}',
      ''
    ]

    writeFileSync(filename, content.join('\n'))

    const routesFilename = join(dirname(dirPath), 'routes.js')
    const routesPath = join(`${domain}`, `${domain}.routes.js`)

    appendFileSync(routesFilename, `export * from './${routesPath}'\n`)
  }
}
