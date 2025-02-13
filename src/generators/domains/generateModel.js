import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { camelCase } from '@devnetic/utils'

import { createFile } from '../../utils/index.js'

export const generateModel = (dirPath, domain) => {
  const modelPath = join(dirPath, `${domain}.model.js`)
  const domainName = camelCase(domain)

  createFile(modelPath)

  if (existsSync(modelPath)) {
    const content = [
      'import { baseModel } from \'../../common/index.js\'',
      `import { ${domainName} } from './${domain}.schema.js'`,
      '',
      `export const model = baseModel(${domainName})`,
      ''
    ]

    writeFileSync(modelPath, content.join('\n'))
  }
}
