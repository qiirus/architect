import { dirname, join } from 'node:path'
import { appendFileSync, existsSync } from 'node:fs'

import { camelCase, pascalCase, snakeCase } from '@devnetic/utils'
import pluralize from 'pluralize'

import { createFile } from '../../utils/index.js'

export const generateSchema = (domainName, domainPath) => {
  const filepath = join(domainPath, `${domainName}.schema.js`)
  const tableName = camelCase(domainName)
  const schemaName = pascalCase(pluralize.singular(domainName))

  if (!existsSync(filepath)) {
    const content = [
      'import {',
      '  pgTable,',
      '  timestamp,',
      '  uuid',
      "} from 'drizzle-orm/pg-core'",
      '',
      "import { createSelectSchema } from '../../common/schema/inferSchema.js'",
      "import { omit } from '../../common/schema/omit.js'",
      "import { partial } from '../../common/schema/partial.js'",
      "import { pick } from '../../common/schema/pick.js'",
      "import { registerSchema } from '../../common/schema/registry.js'",
      '',
      `export const ${tableName} = pgTable('${snakeCase(domainName)}', {`,
      "  id: uuid('id').primaryKey().defaultRandom().notNull(),",
      "  created_at: timestamp('created_at', { precision: 6, withTimezone: true })",
      '    .defaultNow()',
      '    .notNull(),',
      "  updated_at: timestamp('updated_at', { precision: 6, withTimezone: true })",
      '    .defaultNow()',
      '    .notNull()',
      '})',
      '',
      `const selectSchema = createSelectSchema(${tableName})`,
      '',
      `export const Select${schemaName}Schema = partial(selectSchema)`,
      `export const Create${schemaName}Schema = omit(selectSchema, [`,
      "  'id',",
      "  'created_at',",
      "  'updated_at'",
      '])',
      '',
      `const ${schemaName}Schema = Select${schemaName}Schema`,
      '',
      `export const Id${schemaName}Schema = pick(Select${schemaName}Schema, ['id'])`,
      `export const Update${schemaName}Schema = partial(Create${schemaName}Schema)`,
      '',
      `registerSchema('${schemaName}', ${schemaName}Schema)`,
      ''
    ]

    createFile(filepath, content.join('\n'))

    const schemasFilename = join(dirname(domainPath), 'schemas.js')
    const schemaPath = join(`${domainName}`, `${domainName}.schema.js`)

    appendFileSync(schemasFilename, `export * from './${schemaPath}'\n`)
  }
}
