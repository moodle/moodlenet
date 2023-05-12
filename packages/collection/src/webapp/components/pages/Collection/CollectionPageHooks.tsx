import { useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { proxyProps } from '@moodlenet/react-app/ui'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import { validationSchema } from '../../../../common/validationSchema.mjs'
import { useMainHook } from '../../../MainHooks.js'
import type { MainCollectionCardSlots } from '../../organisms/MainCollectionCard/MainCollectionCard.jsx'
import type { CollectionProps } from './Collection.js'

export const useCollectionPageProps = ({
  collectionKey,
}: {
  collectionKey: string
}): CollectionProps | null => {
  // const { isAuthenticated } = useContext(AuthCtx)
  const _mainProps = useMainHook({ collectionKey })
  const mainLayoutProps = useMainLayoutProps()

  const collectionProps = useMemo(() => {
    if (!_mainProps || !mainLayoutProps) return null
    const { actions, props, isSaving } = _mainProps
    const resourceCardPropsList: CollectionProps['resourceCardPropsList'] = props.resourceList.map(
      ({ _key }) => {
        return {
          key: _key,
          resourceCardProps: proxyProps(useResourceCardProps, _key),
        }
      },
    )

    const layoutProps = {
      wideColumnItems: [],
      mainColumnItems: [],
      sideColumnItems: [],
      moreButtonItems: [],
      extraDetailsItems: [],
    }
    const { contributor, form: collectionForm } = props

    const mainCollectionCardSlots: MainCollectionCardSlots = {
      mainColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: [],
      footerRowItems: [],
      headerColumnItems: [],
      moreButtonItems: [],
    }

    const propsPage: CollectionProps = {
      mainLayoutProps,
      mainCollectionCardSlots,
      resourceCardPropsList,
      collectionContributorCardProps: contributor,
      ...layoutProps,
      ...props,
      collectionForm,
      validationSchema,
      actions,
      access: {
        ...props.access,
        // isAuthenticated,
        isCreator: _mainProps.props.access.isCreator,
      },
      isSaving,
    }

    return propsPage
  }, [_mainProps, mainLayoutProps])

  return collectionProps
}
