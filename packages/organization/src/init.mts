import './expose.mjs'
import { publicFiles } from './fsStore.mjs'
import './initializeData.mjs'

// FIXME: REMOVE_ME
publicFiles.mountStaticHttpServer('/public')
