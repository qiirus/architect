import { exec } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { readFile, rename, writeFile } from 'node:fs/promises'

import { config } from '../../../config/index.js'
import { colorize, CYAN } from '../../utils/colorize.js'

/**
 *
 * @param {string} name
 * @param {string} applicationPath
 * @returns
 */
export const setupApplication = async (appName, applicationPath) => {
  const dependencies = [
    '@fastify/compress',
    '@fastify/cors',
    '@fastify/csrf-protection',
    '@fastify/helmet',
    '@fastify/multipart',
    '@fastify/swagger',
    '@fastify/swagger-ui',
    'drizzle-orm',
    'fastify',
    'http-status-codes',
    'pino',
    'pino-pretty',
    'pino-tee',
    'postgres'
  ]

  const devDependencies = [
    '@jest/globals',
    'commitizen',
    'cz-conventional-changelog',
    'drizzle-kit',
    'husky',
    'jest',
    'standard'
  ]

  const packagePath = join(applicationPath, 'package.json')

  await replaceConstant('APP_NAME', appName, packagePath)

  console.log(colorize('Configuring Docker/Docker Compose.', CYAN))
  await setupDocker(appName, applicationPath)

  console.log(colorize('Defining application configuration.', CYAN))
  await setupConfig(appName, applicationPath)

  console.log(colorize('Installing NPM dependencies.', CYAN))
  await installDependencies(dependencies, applicationPath)

  console.log(colorize('Installing NPM dev dependencies.', CYAN))
  await installDependencies(devDependencies, applicationPath)
}

/**
 *
 * @param {string} appName
 * @param {string} applicationPath
 * @returns {void}
 */
const setupConfig = async (appName, applicationPath) => {
  await replaceConstant(
    'APP_NAME',
    appName,
    join(applicationPath, 'config/index.js')
  )

  await replaceConstant(
    'APP_DESCRIPTION',
    `Description for ${appName} OpenAPI Specification`,
    join(applicationPath, 'config/index.js')
  )
}

/**
 *
 * @param {string} appName
 * @param {string} applicationPath
 * @returns {void}
 */
const setupDocker = async (appName, applicationPath) => {
  const nodeVersion = await getNodeVersion()
  const nodeImageVersion = await getNodeImageVersion(nodeVersion)
  const postgresImageVersion = await getPostgresImageVersion()

  await rename(
    join(applicationPath, 'docker-compose.override.yml.dist'),
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'NODE_LTS_VERSION',
    nodeImageVersion,
    join(applicationPath, 'Dockerfile')
  )

  await replaceConstant(
    'API_CONTAINER_NAME',
    `${appName}-container`,
    join(applicationPath, 'docker-compose.yml')
  )

  await replaceConstant(
    'DATABASE_PROVIDER_DB',
    `${config.database.provider.toUpperCase()}_DB`,
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'DATABASE_PROVIDER_USER',
    `${config.database.provider.toUpperCase()}_USER`,
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'DATABASE_PROVIDER_PASSWORD',
    `${config.database.provider.toUpperCase()}_PASSWORD`,
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'DATABASE_PROVIDER',
    `${config.database.provider}`,
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'DATABASE_IMAGE_VERSION',
    postgresImageVersion,
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'DATABASE_CONTAINER_NAME',
    `${appName}-database-container`,
    join(applicationPath, 'docker-compose.override.yml')
  )
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @param {string} packagePath
 * @returns {Promise<void>}
 */
const replaceConstant = async (constant, value, filePath) => {
  const packageContent = await readFile(filePath, 'utf8')

  return writeFile(filePath, packageContent.replaceAll(constant, value))
}

/**
 *
 * @param {string[]} dependencies
 * @param {string} dependencies
 * @returns {Buffer}
 */
const installDependencies = async (dependencies, applicationPath) => {
  const execPromise = promisify(exec)

  const { stdout, stderr } = await execPromise(`npm i ${dependencies.join(' ')} --prefix ${applicationPath} --quiet`)

  console.log(`${stdout}`)

  if (stderr) {
    console.error(stderr)

    process.exit(1)
  }
}

const getPostgresImageVersion = async (imageName = 'alpine') => {
  const repo = 'library/postgres'
  const url = `https://hub.docker.com/v2/repositories/${repo}/tags/?page_size=100&name=${imageName}&ordering=last_updated`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!data.results) {
      throw new Error('No results found')
    }

    // Filter tags that match the pattern X.Y-alpineX.YY
    const imageVersionRegex = new RegExp(`\\d+\\.\\d+-${imageName}$`, 'g')

    const imageTags = data.results
      .map(tag => tag.name)
      .filter(name => imageVersionRegex.test(name))

    if (imageTags.length === 0) {
      throw new Error(`No ${imageName} versions found`)
    }

    // Sort versions numerically
    imageTags.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

    return imageTags[0]
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}

const getNodeImageVersion = async (nodeVersion, imageName = 'alpine') => {
  const repo = 'library/node'
  const url = `https://hub.docker.com/v2/repositories/${repo}/tags/?page_size=100&name=${imageName}&ordering=last_updated`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!data.results) {
      throw new Error('No results found')
    }

    // Filter tags that match the pattern X.Y-alpineX.YY
    const imageVersionRegex = new RegExp(`${nodeVersion}-${imageName}$`, 'g')

    const imageTags = data.results
      .map(tag => tag.name)
      .filter(name => imageVersionRegex.test(name))

    if (imageTags.length === 0) {
      throw new Error('No Alpine versions found')
    }

    // Sort versions numerically
    imageTags.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

    return imageTags[0]
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}

/**
 * @returns {string}
 */
const getNodeVersion = async () => {
  const response = await fetch('https://nodejs.org/download/release/index.json')
  const versions = await response.json()

  return versions.filter((version) => version.lts)[0].version.replace(/[a-zA-Z]/g, '')
}
