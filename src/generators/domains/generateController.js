import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { createFile } from '../../utils/index.js'

export const generateController = (domainName, domainPath) => {
  const filePath = join(domainPath, `${domainName}.controller.js`)

  if (!existsSync(filePath)) {
    const content = [
      'import { baseController } from \'../../common/index.js\'',
      `import { model } from './${domainName}.model.js'`,
      '',
      'export const controller = baseController(model)',
      ''
    ]

    createFile(filePath, content.join('\n'))
  }
}
