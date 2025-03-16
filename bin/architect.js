#!/usr/bin/env node

import {
  displayUsage,
  createApplication,
  generateDomain,
  RED,
  colorize
} from '../src/utils/index.js'

const main = async () => {
  const validOptions = [
    '-d',
    '--domain',
    '-n',
    '--new',
    '-h',
    '--help'
  ]

  // Parse command-line arguments
  const args = process.argv.slice(2)
  // const args = ['-d', 'users']
  // const args = ['-n', 'rest-api']

  const option = args[0]
  const parameter = args[1]

  // if (option === '-h' || option === '--help') {
  //   displayUsage()

  //   process.exit(0)
  // }

  if (!validOptions.includes(option)) {
    console.log(colorize(`Error: Invalid option '${option}'\n`, RED))

    displayUsage()

    process.exit(1)
  }

  if (args.length < 2) {
    console.log(colorize(`Parameter is missing for option '${option}'\n`, RED))

    displayUsage()

    process.exit(1)
  }

  const currentPath = process.cwd()
  // process.exit(1)

  // const currentPath = '/home/aagamezl/workspace/personal/git-repos/rest-flow/experiments/rest-api'

  // console.log('cwd: %o', process.cwd())
  // console.log('dirname: %o', import.meta.dirname)

  // process.exit(1)

  switch (option) {
    case '-d':
    case '--domain':
      generateDomain(parameter, currentPath)

      break

    case '-n':
    case '--new':
      try {
        await createApplication(parameter, currentPath)
      } catch (error) {
        console.error('Error:', error)
      }

      break

    default:
      console.log(colorize(`Error: Invalid option '${option}'\n`, RED))

      displayUsage()

      process.exit(1)
  };
}

main()
