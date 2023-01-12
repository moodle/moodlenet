import { fork } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeGenerated } from './init.lib.mjs'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

await writeGenerated()

const wp_compile_process = fork(resolve(__dirname, 'webpack', '-prod-compile.mjs'))
wp_compile_process.once('exit', sig => {
  console.log(`webpack compiler done ... exited with signal ${sig}`)
})
process.on('exit', () => wp_compile_process.kill('SIGKILL'))
