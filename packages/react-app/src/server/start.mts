import { fork } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { env } from './init/env.mjs'
import { writeGenerated } from './webapp-plugins.mjs'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

await writeGenerated()

if (!env.noWebappServer) {
  const wp_compile_process = fork(resolve(__dirname, 'webpack', '-prod-compile.mjs'))
  wp_compile_process.once('error', err => {
    console.log(`webpack compiler error ... ${err}`)
  })
  wp_compile_process.once('exit', sig => {
    console.log(`webpack compiler ${sig === 0 ? 'done' : 'error'} ... exited with signal ${sig}`)
    wp_compile_process.kill('SIGKILL')
  })
}
