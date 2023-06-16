import { shell } from './shell.mjs'
import { shutdownGracefullyLocalServer } from './start.mjs'

shell.log('info', `HTTP: stopping server`)
const err = await shutdownGracefullyLocalServer().catch(err => err)
shell.log('info', { 'HTTP: server stopped': !err ? 'successfully' : 'with error', err })
