import graphConn from '@moodlenet/content-graph'
import { useApis } from '@moodlenet/core'
import reactAppConn from '@moodlenet/react-app'

export const reactAppPkgApis = useApis(import.meta, reactAppConn)
export const graphConnPkgApis = useApis(import.meta, graphConn)
