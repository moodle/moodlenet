import { pkgConnection } from '@moodlenet/core'
import reactAppPkgRef from '@moodlenet/react-app'

export const reactAppPkg = await pkgConnection(import.meta, reactAppPkgRef)
