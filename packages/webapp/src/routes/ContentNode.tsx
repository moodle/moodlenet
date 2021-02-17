// import { NodeType } from '../graphql/types.graphql.gen'
import { NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Routes } from '../../../common/lib/webapp/sitemap'
import { NeverPage } from '../helpers/navigation'
import { MNRouteProps, RouteFC } from './lib'

const camelCaseType = (_: string) => (_ && _[0].toUpperCase() + _.substr(1)) as NodeType

export const ContentNodeComponent: RouteFC<Routes.ContentNode> = ({
  match: {
    params: { key, nodeType },
  },
}) => {
  // TODO: check isKey(key)
  nodeType = camelCaseType(nodeType)
  switch (nodeType) {
    case NodeType.User:
      return <div>Content Page User/{key}</div>
    case NodeType.Subject:
      return <div>Content Page Subject/{key}</div>
    case NodeType.Collection:
      return <div>Content Page Collection/{key}</div>
    case NodeType.Resource:
      return <div>Content Page Resource/{key}</div>
    default:
      return NeverPage(nodeType)
  }
}

export const ContentNodeRoute: MNRouteProps<Routes.ContentNode> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:key',
  exact: false,
}
