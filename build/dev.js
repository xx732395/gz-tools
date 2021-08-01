import chalk from 'chalk'
import rollup from 'rollup'
import { log } from './utils'
import baseConfig from './base.config'

const watchOptions = {
  ...baseConfig,
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**']
  }
}
const watcher = rollup.watch(watchOptions)
log(chalk.cyan('Start rollup watcher...\n'))

watcher.on('event', event => {
  if (event.code === 'START') {
    log(chalk.cyan('Build begin...'))
  } else if (event.code === 'END') {
    log(chalk.cyan('Build end.\n'))
  } else if (event.code === 'ERROR') {
    log(chalk.red(event.error))
    log(chalk.red('Rollup watcher is shutdown cause a fatal error.\n'))
    watcher.close()
  }
})
