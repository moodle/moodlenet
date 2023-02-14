import './expose.mjs'
import { publicFiles } from './fsStore.mjs'
import './initializeData.mjs'

// FIXME: REMOVE_ME
await publicFiles.mountStaticHttpServer('/public')
