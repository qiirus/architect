#!/usr/bin/env node

import { displayUsage, generateApplication, generateDomain } from '../src/utils/index.js'

// Parse command-line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
  displayUsage()

  process.exit(1)
}

const option = args[0]
const parameter = args[1]

// console.log('cwd: %o', process.cwd())
// console.log('dirname: %o', import.meta.dirname)

switch (option) {
  case '-d':
    generateDomain(parameter)

    break
  case '-n':
    generateApplication(parameter, process.cwd(), import.meta.dirname)

    break
  default:
    console.log(`Error: Invalid option '${option}'.`)
    displayUsage()

    process.exit(1)
};
