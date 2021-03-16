import { Id, parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { ContentNode } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { webappLinkDef } from '../helpers/navigation'

//TODO: move this
export const contentNodeLink = <N extends { _id: Id }>(_: N) => {
  const { nodeType, _key: key } = parseNodeId(_._id)
  return webappLinkDef<ContentNode>('/content/:nodeType/:key', { key, nodeType: nodeType.toLowerCase() })
}
