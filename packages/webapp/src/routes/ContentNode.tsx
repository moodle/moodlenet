// import { NodeType } from '../graphql/types.graphql.gen'
// import { BaseContentNodeFeed } from '../ui/components/BaseContentNodeFeed'
import { NodeType, parseNodeIdString } from '@moodlenet/common/lib/utils/content-graph'
import { Routes } from '../../../common/lib/webapp/sitemap'
import { NeverPage } from '../helpers/navigation'
import { CollectionPageComponent } from './ContentNode/CollectionPage'
import { ProfilePageComponent } from './ContentNode/ProfilePage'
import { ResourcePageComponent } from './ContentNode/ResourcePage'
import { SubjectPageComponent } from './ContentNode/SubjectPage'
import { MNRouteProps, RouteFC } from './lib'

export const ContentNodeComponent: RouteFC<Routes.ContentNode> = ({ match: { params } }) => {
  const parsedId = parseNodeIdString(`${params.nodeType}/${params.key}`)
  if (!parsedId) {
    return NeverPage(null as never)
  }
  const { id, nodeType } = parsedId
  if (nodeType === NodeType.Profile) {
    return <ProfilePageComponent id={id} />
  } else if (nodeType === NodeType.Subject) {
    return <SubjectPageComponent id={id} />
  } else if (nodeType === NodeType.Collection) {
    return <CollectionPageComponent id={id} />
  } else if (nodeType === NodeType.Resource) {
    return <ResourcePageComponent id={id} />
  } else {
    return NeverPage(nodeType)
  }
}

export const ContentNodeRoute: MNRouteProps<Routes.ContentNode> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:key',
  exact: false,
}
