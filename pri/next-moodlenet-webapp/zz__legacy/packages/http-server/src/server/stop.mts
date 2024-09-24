import { shell } from './shell.mjs'
import { shutdownGracefullyLocalServer } from './start.mjs'

shell.log('info', `stopping server`)
const err = await shutdownGracefullyLocalServer().catch(err => err)
shell.log('info', { 'server stopped': !err ? 'successfully' : 'with error', err })
