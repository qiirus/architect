import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { camelCase } from '@devnetic/utils'

import { createFile } from '../../utils/index.js'

export const generateModel = (domainName, domainPath) => {
  const filePath = join(domainPath, `${domainName}.model.js`)
  const schemaName = camelCase(domainName)

  if (!existsSync(filePath)) {
    const content = [
      'import { baseModel } from \'../../common/index.js\'',
      `import { ${schemaName} } from './${domainName}.schema.js'`,
      '',
      `export const model = baseModel(${schemaName})`,
      ''
    ]

    createFile(filePath, content.join('\n'))
  }
}
