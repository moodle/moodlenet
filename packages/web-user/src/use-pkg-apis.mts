import graphConn from '../../content-graph/dist/init.mjs'
import { pkgConnection } from '@moodlenet/core'
import reactAppConn from '@moodlenet/react-app'

export const reactAppPkg = await pkgConnection(import.meta, reactAppConn)
export const graphPkg = await pkgConnection(import.meta, graphConn)
