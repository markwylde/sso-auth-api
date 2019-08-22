const util = require('util')

const chalk = {
  cyan: (...args) => util.format('\x1b[36m%s\x1b[0m', ...args),
  white: (...args) => util.format('\x1b[37m%s\x1b[0m', ...args),
  yellow: (...args) => util.format('\x1b[33m%s\x1b[0m', ...args),
  red: (...args) => util.format('\x1b[31m%s\x1b[0m', ...args),
  bgRed: (...args) => util.format('\x1b[31m%s\x1b[0m', ...args)
}

let logger

const debugLogger = (type, args) => {
  process.stdout.write((type + '       ').substr(0, 16))
  for (const arg of args) {
    if (typeof arg === 'object') {
      process.stdout.write(' ' + util.inspect(arg))
    } else {
      process.stdout.write(' ' + chalk.cyan(arg.toString()))
    }
  }
  process.stdout.write('\n')
}

const productionLogger = (type, args) => {
  let data

  if (typeof args[0] === 'object') {
    data = { type, ...args[0] }
  } else {
    data = { type, message: args[0] }
  }

  if (args[1]) {
    data.message = args[1]
  }

  console.log(JSON.stringify(data))
}

if (process.env.DEBUG_LOGGING === 'true') {
  logger = {
    trace: (...args) => debugLogger(chalk.cyan('TRACE'), args),
    debug: (...args) => debugLogger(chalk.cyan('DEBUG'), args),
    info: (...args) => debugLogger(chalk.white('INFO'), args),
    warn: (...args) => debugLogger(chalk.yellow('WARN'), args),
    error: (...args) => debugLogger(chalk.red('ERROR'), args),
    fatal: (...args) => debugLogger(chalk.bgRed('FATAL'), args)
  }
} else {
  logger = {
    trace: (...args) => productionLogger('TRACE', args),
    debug: (...args) => productionLogger('DEBUG', args),
    info: (...args) => productionLogger('INFO', args),
    warn: (...args) => productionLogger('WARN', args),
    error: (...args) => productionLogger('ERROR', args),
    fatal: (...args) => productionLogger('FATAL', args)
  }
}

module.exports = logger
