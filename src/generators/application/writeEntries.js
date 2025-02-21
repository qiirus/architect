import { Buffer } from 'node:buffer'
import { join } from 'node:path'
import { writeFile, mkdir } from 'node:fs/promises'

/**
 *
 * @param {string} currentPath
 * @param {import('./downloadFramework').ZipEntries} entries
 */
export const writeEntries = async (currentPath, entries) => {
  for (const [name, entry] of Object.entries(entries)) {
    console.log(name, entry.size, entry.isDirectory)

    if (entry.isDirectory) {
      await mkdir(join(currentPath, name), { recursive: true })

      continue
    }

    const data = await entry.arrayBuffer()

    await writeFile(join(currentPath, name), Buffer.from(data))
  }
}
