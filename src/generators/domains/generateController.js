import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { createFile } from '../../utils/index.js'

export const generateController = (dirPath, domain) => {
  const controllerPath = join(dirPath, `${domain}.controller.js`)

  createFile(controllerPath)

  if (existsSync(controllerPath)) {
    const content = [
      'import { baseController } from \'../../common/index.js\'',
      `import { model } from './${domain}.model.js'`,
      '',
      'export const controller = baseController(model)',
      ''
    ]

    writeFileSync(controllerPath, content.join('\n'))
  }
}
