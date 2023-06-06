import { useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { createHookPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { useMemo } from 'react'
import { validationSchema } from '../../../../common/validationSchema.mjs'
import { useMainHook } from '../../../MainHooks.js'
import type { MainCollectionCardSlots } from '../../organisms/MainCollectionCard/MainCollectionCard.jsx'
import type { CollectionProps } from './Collection.js'

export const CollectionPagePlugins = createHookPlugin<
  {
    generalAction: AddonItemNoKey
    topRightHeaderItems: AddonItemNoKey
  },
  {
    collectionKey: string
  }
>({ generalAction: null, topRightHeaderItems: null })

export const useCollectionPageProps = ({
  collectionKey,
}: {
  collectionKey: string
}): CollectionProps | null => {
  // const { isAuthenticated } = useContext(AuthCtx)
  const _mainProps = useMainHook({ collectionKey })
  const mainLayoutProps = useMainLayoutProps()
  const [addons] = CollectionPagePlugins.useHookPlugin({ collectionKey })

  const collectionProps = useMemo(() => {
    if (!_mainProps || !mainLayoutProps) return null
    const { actions, props, isSaving } = _mainProps
    const resourceCardPropsList: CollectionProps['resourceCardPropsList'] = props.resourceList.map(
      ({ _key }) => {
        return {
          key: _key,
          props: proxyWith(function usePropProxy() {
            return { props: useResourceCardProps(_key) }
          }),
        }
      },
    )

    const layoutProps: Pick<
      CollectionProps,
      'wideColumnItems' | 'mainColumnItems' | 'rightColumnItems' | 'extraDetailsItems'
    > = {
      wideColumnItems: [],
      mainColumnItems: [],
      rightColumnItems: [],
      extraDetailsItems: [],
    }
    const { contributor, form: collectionForm } = props

    const mainCollectionCardSlots: MainCollectionCardSlots = {
      mainColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: addons.topRightHeaderItems,
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
        isCreator: _mainProps.props.access.isCreator,
      },
      isSaving,
    }

    return propsPage
  }, [_mainProps, addons.topRightHeaderItems, mainLayoutProps])

  return collectionProps
}
