import { appendFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

import pluralize from 'pluralize'

import { createDirectory, createFile } from '../../utils/index.js'

export const generateFixtures = (domainName, currentPath) => {
  const directoryPath = join(currentPath, 'tests', 'fixtures')
  const indexFilePath = join(directoryPath, 'index.js')
  const commonFilePath = join(directoryPath, 'common.js')
  const domainFilePath = join(directoryPath, `${domainName}.js`)

  createDirectory(directoryPath, true)

  if (!existsSync(commonFilePath)) {
    const content = [
      `export const id = '${randomUUID()}'`,
      'export const createdAt = \'2023-04-12T21:55:05.045Z\'',
      'export const updatedAt = \'2023-04-12T21:55:05.045Z\'',
      ''
    ]

    createFile(commonFilePath, content.join('\n'), true)
  }

  if (!existsSync(indexFilePath)) {
    const content = [
      'export * from \'./common.js\'',
      ''
    ]

    createFile(indexFilePath, content.join('\n'), true)
  }

  if (!existsSync(domainFilePath)) {
    const content = [
      'import { id, createdAt, updatedAt } from \'./common.js\'',
      '',
      'export const base = {',
      '}',
      '',
      'export const payload = {',
      '  ...base,',
      '}',
      '',
      `export const ${pluralize.singular(domainName)} = {`,
      '  id,',
      '  ...base,',
      '  created_at: createdAt,',
      '  updated_at: updatedAt',
      '}',
      ''
    ]

    createFile(domainFilePath, content.join('\n'), true)
  }

  appendFileSync(indexFilePath, `export * from './${domainName}.js'\n`)
}
