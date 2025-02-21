import { join, resolve } from 'node:path'
import { rename } from 'node:fs/promises'

import { downloadFramework } from './downloadFramework.js'
import { setupApplication } from './setupApplication.js'
import { writeEntries } from './writeEntries.js'

/**
 *
 * @param {string} name
 * @param {string} currentPath
 */
export const createApplication = async (name, currentPath) => {
  const frameworkUrl = 'https://github.com/rest-flow/framework/archive/refs/heads/feat/initial-setup.zip'
  // const frameworkUrl = 'https://codeload.github.com/rest-flow/framework/zip/refs/heads/feat/initial-setup'

  try {
    const entries = await downloadFramework(frameworkUrl)

    await writeEntries(currentPath, entries)

    const frameworkRoot = Object.entries(entries)[0][0]
    const applicationPath = join(currentPath, name)

    await rename(resolve(join(currentPath, frameworkRoot)), join(currentPath, name))

    await setupApplication(name, applicationPath)
  } catch (error) {
    console.error(error.message)

    throw error
  }
}
