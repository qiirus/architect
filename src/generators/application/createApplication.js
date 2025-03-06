import { join, resolve } from 'node:path'
import { rename } from 'node:fs/promises'

import { downloadFramework } from './downloadFramework.js'
import { setupApplication } from './setupApplication.js'
import { writeEntries } from './writeEntries.js'
import { colorize, CYAN, GREEN, YELLOW } from '../../utils/colorize.js'

/**
 *
 * @param {string} name
 * @param {string} currentPath
 */
export const createApplication = async (appName, currentPath) => {
  // const frameworkUrl = 'https://github.com/rest-flow/framework/archive/refs/heads/feat/initial-setup.zip'
  const frameworkUrl = 'http://localhost:5500/framework.zip'

  try {
    console.log(colorize('Creating Application', CYAN))

    const entries = await downloadFramework(frameworkUrl)

    await writeEntries(currentPath, entries)

    const frameworkRoot = Object.entries(entries)[0][0]
    const applicationPath = join(currentPath, appName)

    await rename(resolve(join(currentPath, frameworkRoot)), join(currentPath, appName))

    console.log(colorize('Configuring the application.', CYAN))

    await setupApplication(appName, applicationPath)

    console.log(colorize('Your application is ready to use.', GREEN))

    console.log(colorize(`cd ${appName}`, YELLOW))

    console.log(colorize('npm run start:dev', YELLOW))
  } catch (error) {
    console.error(error.message)

    throw error
  }
}
