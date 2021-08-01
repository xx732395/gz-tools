import chalk from 'chalk'

function z(num) {
  return `${num >= 10 ? '' : '0'}${num}`
}

export function formatTime(date) {
  return (
    `${date.getFullYear()}-${z(date.getMonth() + 1)}-${z(date.getDate())} ` +
    `${z(date.getHours())}:${z(date.getMinutes())}:${z(date.getSeconds())}`
  )
}

export function log(msg) {
  console.log(`[${chalk.green(formatTime(new Date()))}] ${msg}`)
}
