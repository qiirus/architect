import { join } from 'node:path'
import { existsSync } from 'node:fs'

import { pascalCase } from '@devnetic/utils'
import pluralize from 'pluralize'

import { createFile } from '../../utils/index.js'

export const generateValidations = (domainName, domainPath) => {
  const validationPath = join(domainPath, `${domainName}.validation.js`)
  const schemaName = pascalCase(pluralize.singular(domainName))

  if (!existsSync(validationPath)) {
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
      `  // POST /${domainName}`,
      '  create: {',
      `    [REQUEST_SEGMENTS.BODY]: Create${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createResponseSchema({ $ref: '${schemaName}' })`,
      '  },',
      '',
      `  // DELETE /${domainName}/:id`,
      '  delete: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      '    [REQUEST_SEGMENTS.RESPONSE]: createDeleteByIdResponseSchema()',
      '  },',
      '',
      `  // GET /${domainName}`,
      '  getAll: {',
      '    [REQUEST_SEGMENTS.QUERY]: createQuerySchema(),',
      `    [REQUEST_SEGMENTS.RESPONSE]: createAllResponseSchema(Select${schemaName}Schema)`,
      '  },',
      '',
      `  // GET /${domainName}/:id`,
      '  getById: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createByIdResponseSchema({ $ref: '${schemaName}' })`,
      '  },',
      '',
      `  // PATCH /${domainName}/:id`,
      '  patch: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.BODY]: Update${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createByIdResponseSchema({ $ref: '${schemaName}' })`,
      '  },',
      '',
      `  // PUT /${domainName}/:id`,
      '  put: {',
      `    [REQUEST_SEGMENTS.PARAMS]: Id${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.BODY]: Create${schemaName}Schema,`,
      `    [REQUEST_SEGMENTS.RESPONSE]: createByIdResponseSchema({ $ref: '${schemaName}' })`,
      '  }',
      '}',
      ''
    ]

    createFile(validationPath, content.join('\n'))
  }
}
