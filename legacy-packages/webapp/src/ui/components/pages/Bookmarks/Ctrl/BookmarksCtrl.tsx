import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { BookmarksProps } from '../Bookmarks'
import { useBookmarksPageLazyQuery } from './Bookmarks.gen'

export const useBookmarksCtrl: CtrlHook<BookmarksProps, {}> = () => {
  // const [sortBy, setSortBy] = useState<GlobalBookmarksSort>('Popularity')
  const { session } = useSession()
  const [queryBookmarks, bookmarksQ] = useBookmarksPageLazyQuery({
    fetchPolicy: 'cache-and-network',
  })
  useEffect(() => {
    if (!session?.profile.id) {
      return
    }
    queryBookmarks({
      variables: {
        profileId: session.profile.id,
      },
    })
  }, [queryBookmarks, session?.profile.id])

  const profileNode = narrowNodeType(['Profile', 'Organization'])(
    bookmarksQ.data?.node
  )

  const collections = useMemo(
    () =>
      (profileNode?.collections.edges || [])
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node }) => node),
    [profileNode?.collections.edges]
  )
  const resources = useMemo(
    () =>
      (profileNode?.resources.edges || [])
        .filter(isEdgeNodeOfType(['Resource']))
        .map(({ node }) => node),
    [profileNode?.resources.edges]
  )

  const bookmarksUIProps = useMemo(() => {
    const props: BookmarksProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),

      browserProps: {
        collectionCardPropsList: collections.map((collection) =>
          ctrlHook(
            useCollectionCardCtrl,
            { id: collection.id },
            `Bookmarks Collection ${collection.id} Card`
          )
        ),
        resourceCardPropsList: resources.map((resource) =>
          ctrlHook(
            useResourceCardCtrl,
            { id: resource.id, removeAction: false },
            `Bookmarks Resource ${resource.id} Card`
          )
        ),
        subjectCardPropsList: null,
        setSortBy: null,
        smallProfileCardPropsList: null,
        setFilters: null,
        title: t`Bookmarks`,
      },
    }
    return props
  }, [collections, resources])
  return [bookmarksUIProps]
}
