import { isEdgeNodeOfType } from '@moodlenet/common/lib/graphql/helpers'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { useHeaderCtrl } from '../../../components/Header/Ctrl/HeaderCtrl'
import { SubHeaderProps } from '../../../components/molecules/SubHeader/SubHeader'
import { href } from '../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { FollowTag } from '../../../types'
import { HeaderPageProps } from '../HeaderPage'
import { useHeaderPagePinnedLazyQuery } from './HeaderPageCtrl.gen'

export const useHeaderPageCtrl: CtrlHook<HeaderPageProps, {}> = () => {
  const { isAuthenticated, session } = useSession()
  const [queryPinned, pinned] = useHeaderPagePinnedLazyQuery()

  useEffect(() => {
    if (session) {
      queryPinned({ variables: { currentProfileId: session.profile.id } })
    }
  }, [session, queryPinned])

  const subHeaderProps = useMemo<SubHeaderProps>(() => {
    const tags =
      pinned.data?.node?.pinnedList.edges.filter(isEdgeNodeOfType(['IscedField'])).map<FollowTag>(({ node }) => ({
        name: node.name,
        type: 'General',
        subjectHomeHref: href(nodeGqlId2UrlPath(node.id)),
      })) ?? []
    return {
      tags,
    }
  }, [pinned.data?.node?.pinnedList.edges])

  const headerPageProps = useMemo<HeaderPageProps>(() => {
    const headerPageProps: HeaderPageProps = {
      subHeaderProps,
      isAuthenticated,
      headerProps: ctrlHook(useHeaderCtrl, {}, 'Header'),
    }
    return headerPageProps
  }, [isAuthenticated, subHeaderProps])

  return [headerPageProps]
}
