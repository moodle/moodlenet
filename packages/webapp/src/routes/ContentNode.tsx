// import { NodeType } from '../graphql/types.graphql.gen'
// import { BaseContentNodeFeed } from '../ui/components/BaseContentNodeFeed'
import { parseNodeIdString } from '@moodlenet/common/lib/utils/content-graph'
import { Routes } from '../../../common/lib/webapp/sitemap'
import { NeverPage } from '../helpers/navigation'
import { getUseBaseContentNodePanelProps } from '../hooks/components/BaseContentNodePanel'
import { BaseContentNodePanel } from '../ui/components/BaseContentNodePanel'
import { MNRouteProps, RouteFC } from './lib'

export const ContentNodeComponent: RouteFC<Routes.ContentNode> = ({ match: { params } }) => {
  const parsedId = parseNodeIdString(`${params.nodeType}/${params.key}`)
  if (!parsedId) {
    return NeverPage(null as never)
  }
  const { id /* ,nodeType */ } = parsedId
  // if (nodeType === NodeType.User) {
  //   return <BaseContentNodePanelCtrl id={parsedId}></BaseContentNodePanelCtrl>
  // } else if (nodeType === NodeType.Subject) {
  //   return <div>Content Page Subject/{key}</div>
  // } else if (nodeType === NodeType.Collection) {
  //   return <div>Content Page Collection/{key}</div>
  // } else if (nodeType === NodeType.Resource) {
  //   return <div>Content Page Resource/{key}</div>
  // } else {
  //   return NeverPage(nodeType)
  // }
  const useBaseContentNodePanelProps = getUseBaseContentNodePanelProps({ id })
  return <BaseContentNodePanel useProps={useBaseContentNodePanelProps} />
}

export const ContentNodeRoute: MNRouteProps<Routes.ContentNode> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:key',
  exact: false,
}
