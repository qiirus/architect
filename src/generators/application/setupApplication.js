import { join } from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
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

  installDependencies(dependencies, applicationPath)
  installDependencies(devDependencies, applicationPath)

  await setupDocker(appName, applicationPath)
}

const setupDocker = async (appName, applicationPath) => {
  const nodeVersion = await getNodeVersion()
  const nodeImageVersion = await getNodeImageVersion(nodeVersion.slice(1))
  const postgresImageVersion = await getPostgresImageVersion()

  await replaceConstant(
    'NODE_LTS_VERSION',
    nodeImageVersion,
    join(applicationPath, 'Dockerfile')
  )

  await replaceConstant(
    'DATABASE_CONTAINER_NAME',
    `${appName}-database`,
    join(applicationPath, 'docker-compose.yml')
  )

  await replaceConstant(
    'DATABASE_CONTAINER_NAME',
    `${appName}-database`,
    join(applicationPath, 'docker-compose.override.yml')
  )

  await replaceConstant(
    'DATABASE_IMAGE_VERSION',
    postgresImageVersion,
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

  return writeFile(filePath, packageContent.replace(constant, value))
}

/**
 *
 * @param {string[]} dependencies
 * @param {string} dependencies
 * @returns {Buffer}
 */
const installDependencies = (dependencies, applicationPath) => {
  return execSync(`npm i ${dependencies.join(' ')} --prefix ${applicationPath}`)
}

const getPostgresImageVersion = async () => {
  const repo = 'library/postgres'
  const url = `https://hub.docker.com/v2/repositories/${repo}/tags/?page_size=100`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!data.results) {
      throw new Error('No results found')
    }

    // Filter tags that match the pattern X.Y-alpineX.YY
    const alpineTags = data.results
      .map(tag => tag.name)
      .filter(name => /\d+\.\d+-alpine\d+\.\d+/.test(name))

    if (alpineTags.length === 0) {
      throw new Error('No Alpine versions found')
    }

    // Sort versions numerically
    alpineTags.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

    console.log('Latest PostgreSQL Alpine version:', alpineTags[0])
    return alpineTags[0]
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}

const getNodeImageVersion = async (nodeVersion) => {
  const repo = 'library/node'
  const url = `https://hub.docker.com/v2/repositories/${repo}/tags/?page_size=100`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!data.results) {
      throw new Error('No results found')
    }

    // Filter tags that match the pattern X.Y-alpineX.YY
    const alpineTags = data.results
      .map(tag => tag.name)
      .filter(name => /\d+\.\d+-alpine\d+\.\d+/.test(name))

    if (alpineTags.length === 0) {
      throw new Error('No Alpine versions found')
    }

    // Sort versions numerically
    alpineTags.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

    return alpineTags.find(version => {
      return version.includes(nodeVersion)
    })
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

  const ltsVersions = versions.filter(version => version.lts)

  return ltsVersions[0].version
}
