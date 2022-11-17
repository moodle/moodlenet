#!/usr/bin/env node
import yargs from 'yargs'
import forever from 'forever'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const opts = await yargs(process.argv.slice(2))
const argv = await opts.argv

const runForever = argv.forever === true
console.log(`${runForever ? '' : 'not '}using forever`)
if (!runForever) {
  await import('../lib/main/boot.mjs')
} else {
  const uid = String(Math.random())
  const foreverMonitor = forever.start(
    resolve(dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'main', 'boot.mjs'),
    { uid, env: process.env },
  )
  foreverMonitor.on('exit:code', code => {
    if (code === 0) {
      /////////////////////////////////////////
      return
    }

    foreverMonitor.stop()
  })
}

// _events: {
//   start: [Function: startLogs],
//   restart: [Array],
//   exit: [Function: stopLogs],
//   'watch:error': [Function (anonymous)],
//   'watch:restart': [Function (anonymous)],
//   'exit:code': [Function (anonymous)]
// },
