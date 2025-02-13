import { join } from 'node:path'
import { existsSync, writeFileSync } from 'node:fs'

import { pascalCase } from '@devnetic/utils'
import pluralize from 'pluralize'

import { createFile } from '../../utils/index.js'

export const generateValidations = (dirPath, domain) => {
  const validationPath = join(dirPath, `${domain}.validation.js`)
  const schemaName = pascalCase(pluralize.singular(domain))

  createFile(validationPath)

  if (existsSync(validationPath)) {
    const content = [
      'import {',
      '  REQUEST_SEGMENTS,',
      '  createAllResponseSchema,',
      '  createByIdResponseSchema,',
      '  createDeleteByIdResponseSchema,',
      '  createQuerySchema,',
      '  createResponseSchema',
      "} from '../../common/index.js'",
      'import {',
      `  Create${schemaName}Schema,`,
      `  Id${schemaName}Schema,`,
      `  Update${schemaName}Schema,`,
      `  Select${schemaName}Schema`,
      "} from './index.js'",
      '',
      'export const validations = {',
      `  // POST /${domain}`,
      '  create: {',
      `    [REQUEST_SEGMENTS.BODY]: Create${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createResponseSchema({ $ref: '${schemaName}' })`,
      '  },',
      '',
      `  // DELETE /${domain}/:id`,
      '  delete: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      '    [REQUEST_SEGMENTS.RESPONSE]: createDeleteByIdResponseSchema()',
      '  },',
      '',
      `  // GET /${domain}`,
      '  getAll: {',
      '    [REQUEST_SEGMENTS.QUERY]: createQuerySchema(),',
      `    [REQUEST_SEGMENTS.RESPONSE]: createAllResponseSchema(Select${schemaName}Schema)`,
      '  },',
      '',
      `  // GET /${domain}/:id`,
      '  getById: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createByIdResponseSchema({ $ref: '${schemaName}' })`,
      '  },',
      '',
      `  // PATCH /${domain}/:id`,
      '  patch: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.BODY]: Update${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createByIdResponseSchema({ $ref: '${schemaName}' })`,
      '  },',
      '',
      `  // PUT /${domain}/:id`,
      '  put: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.BODY]: Create${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createByIdResponseSchema({ $ref: '${schemaName}' })`,
      '  }',
      '}',
      ''
    ].join('\n')

    writeFileSync(validationPath, content)
  }
}
