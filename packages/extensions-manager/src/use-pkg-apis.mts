// import graphConn from '@moodlenet/content-graph'
import corePkgConn from '@moodlenet/core'
import { pkgConnection } from '@moodlenet/core'
import reactAppConn from '@moodlenet/react-app'

export const reactAppPkg = await pkgConnection(import.meta, reactAppConn)
export const corePkg = await pkgConnection(import.meta, corePkgConn)

// export const graphConnPkgApis = await pkgConnection(import.meta, graphConn)
