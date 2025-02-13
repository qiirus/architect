import { colorize, CYAN, YELLOW } from './colorize.js'

export const displayUsage = () => {
  console.log(colorize('Usage:', CYAN))
  console.log(`  ${process.argv[1]} <option> <parameter>\n`)

  console.log(colorize('Description:', CYAN))
  console.log('  This script provides tools for managing API resources and generating applications.')
  console.log('  Use the specified option to perform actions.\n')

  console.log(colorize('Options:', CYAN))
  console.log(`  ${colorize('-n', YELLOW)}  Generate a new full application. Requires the application name as an argument.`)
  console.log(`  ${colorize('-d', YELLOW)}  Generate a new domain directory with boilerplate files. Requires the domain path as an argument.\n`)

  console.log(colorize('Parameters:', CYAN))
  console.log(`  ${colorize('<app-name>', YELLOW)}  The name of the new application to generate.`)
  console.log(`  ${colorize('<domain-path>', YELLOW)}  The filesystem path to the domain directory.\n`)

  console.log(colorize('Examples:', CYAN))
  console.log(`  ${process.argv[1]} -n ${colorize('my-app', YELLOW)}`)
  console.log(`  ${process.argv[1]} -d ${colorize('src/domains/users', YELLOW)}\n`)

  process.exit(1)
}
