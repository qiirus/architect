#!/usr/bin/env node

import {
  displayUsage,
  createApplication,
  generateDomain
} from '../src/utils/index.js'

const main = async () => {
  // Parse command-line arguments
  // const args = process.argv.slice(2)
  const args = ['-n', 'app-api']

  if (args.length < 2) {
    displayUsage()

    process.exit(1)
  }

  const option = args[0]
  const parameter = args[1]

  // console.log('cwd: %o', process.cwd())
  // console.log('dirname: %o', import.meta.dirname)

  // process.exit(1)

  switch (option) {
    case '-d':
      generateDomain(parameter)

      break
    case '-n':
      // generateApplication(parameter, process.cwd(), import.meta.dirname)
      try {
        await createApplication(parameter, process.cwd())

        console.log('Download and unzip completed!')
      } catch (error) {
        console.error('Error:', error)
      }

      break
    default:
      console.log(`Error: Invalid option '${option}'.`)
      displayUsage()

      process.exit(1)
  };
}

main()
