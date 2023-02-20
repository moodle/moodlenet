import { shutdownGracefullyLocalServer } from './start.mjs'

console.info(`HTTP: stopping server`)
const err = await shutdownGracefullyLocalServer().catch(err => err)
console.info(`HTTP: server stopped ${err ? 'error:' : 'successfully'}`, err ?? '')
