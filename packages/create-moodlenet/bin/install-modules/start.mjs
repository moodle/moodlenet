import assert from 'assert'
import { fork } from 'child_process'

let shutting_down = false
let rebooting = false
let ignitor_process = null

process.on('SIGINT', processKiller)
process.on('SIGTERM', processKiller)

await boot()
process.send?.('ready')

async function processKiller(sig) {
  bannerLog(`${sig} PROCESS`)
  await shutdownServices(sig)
  bannerLog(`PROCESS ${sig}ed`)
  process.exit()
}

async function reboot() {
  if (shutting_down) {
    return
  }
  rebooting = true
  await shutdownServices('SIGINT')
  await boot()
  rebooting = false
  return
}

async function boot() {
  return new Promise(resolve => {
    bannerLog(`${rebooting ? 'RE' : ''}BOOTING SERVICES`)

    // ignitor_process = fork('ignitor.mjs', { execPath: 'npx', execArgv: ['-y', 'node-dev'] })
    ignitor_process = fork('ignitor.mjs')
    ignitor_process.once('exit', sig => !rebooting && process.exit(sig))
    ignitor_process.on('message', cmd => {
      if (cmd === 'ready') {
        resolve()
        return
      }
      bannerLog(`[${cmd}] COMMAND`)
      switch (cmd) {
        case 'reboot': {
          reboot()
          return
        }
        case 'shutdown': {
          shutdownServices('SIGINT')
          return
        }
      }
    })
  })
}

async function shutdownServices(sig) {
  assert(ignitor_process, 'no process to shutdown')

  if (shutting_down) {
    console.info('already shutting down ....')
    return
  }

  shutting_down = true
  bannerLog(`SHUTTING DOWN SERVICES`)

  return new Promise(resolve => {
    ignitor_process.once('exit', () => {
      bannerLog(`SERVICES SHUT DOWN`)

      ignitor_process = null
      shutting_down = false

      resolve()
    })
    ignitor_process.kill(sig)
  })
}

function bannerLog(msg) {
  const stars = '*'.repeat(msg.length)
  console.info(`

${stars}
${msg}  
${stars}
  
  `)
}
