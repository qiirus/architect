import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { createDirectory, createFile } from '../../utils/index.js'

export const generateStubs = (currentPath) => {
  const stubsPath = join(currentPath, 'tests', 'stubs')
  const filePath = join(stubsPath, 'drizzle.js')
  const indexFilePath = join(stubsPath, 'index.js')

  createDirectory(stubsPath, true)

  if (!existsSync(filePath)) {
    const content = [
      'import { jest } from \'@jest/globals\'',
      '',
      'export const drizzle = (entities = []) => {',
      '  const query = entities.reduce((queries, entity) => {',
      '    queries[entity] = { findFirst: () => { }, findMany: () => { } }',
      '',
      '    return queries',
      '  }, {})',
      '',
      '  return {',
      '    count: jest.fn().mockReturnThis(),',
      '    delete: jest.fn().mockReturnThis(),',
      '    from: jest.fn().mockReturnThis(),',
      '    insert: jest.fn().mockReturnThis(),',
      '    limit: jest.fn(),',
      '    offset: jest.fn(),',
      '    onConflictDoUpdate: jest.fn().mockReturnThis(),',
      '    query,',
      '    returning: jest.fn(),',
      '    select: jest.fn().mockReturnThis(),',
      '    set: jest.fn().mockReturnThis(),',
      '    update: jest.fn().mockReturnThis(),',
      '    values: jest.fn().mockReturnThis(),',
      '    where: jest.fn().mockReturnThis()',
      '  }',
      '}'
    ]

    createFile(filePath, content.join('\n'), true)
  }

  if (!existsSync(indexFilePath)) {
    const content = [
      'export * from \'./drizzle.js\''
    ]

    createFile(indexFilePath, content.join('\n'), true)
  }
}
