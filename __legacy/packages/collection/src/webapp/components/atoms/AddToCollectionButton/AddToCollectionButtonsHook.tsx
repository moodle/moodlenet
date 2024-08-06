import type { OptionItemProp } from '@moodlenet/component-library'
import type { SelectOptionsMulti } from '@moodlenet/react-app/ui'
import { useContext, useEffect, useMemo, useState } from 'react'
import type { CollectionsResorce } from '../../../../common/types.mjs'
import { MainContext } from '../../../MainContext.js'
import type { AddToCollectionButtonProps } from './AddToCollectionButtons.js'

const mapToSelectOption = (value: string, label: string) => ({ value, label })

type Action = 'remove' | 'add'
const empityOptions: SelectOptionsMulti<OptionItemProp> = { opts: [], selected: [] }

const mapHasResourceIfKey = (key: string, action: Action) => (item: CollectionsResorce) => ({
  ...item,
  hasResource: item.collectionKey === key ? action === 'add' : item.hasResource,
})

const mapCollectionsToProps = (acc: SelectOptionsMulti<OptionItemProp>, el: CollectionsResorce) => {
  const item = mapToSelectOption(el.collectionKey, el.collectionName)
  return {
    opts: [...acc.opts, item],
    selected: el.hasResource ? [...acc.selected, item] : acc.selected,
  }
}

export const useAddToCollectionButtons = (resourceKey: string): AddToCollectionButtonProps => {
  const [rpcData, setRpcData] = useState<CollectionsResorce[]>([])
  const {
    rpcCaller: { actionResorce, collectionsResorce },
  } = useContext(MainContext)

  useEffect(() => {
    collectionsResorce(resourceKey).then(setRpcData)
  }, [collectionsResorce, resourceKey])

  const collections = useMemo<AddToCollectionButtonProps['collections']>(
    () => rpcData.reduce(mapCollectionsToProps, empityOptions),
    [rpcData],
  )

  const addToCollectionButtonProps = useMemo(() => {
    const setterCollections = (action: Action, collectionKey: string) => () =>
      setRpcData(rpcData.map(mapHasResourceIfKey(collectionKey, action)))

    const actions = (action: Action) => (collectionKey: string) =>
      actionResorce(collectionKey, action, resourceKey).then(
        setterCollections(action, collectionKey),
      )

    const props: AddToCollectionButtonProps = {
      add: actions('add'),
      remove: actions('remove'),
      collections,
    }

    return props
  }, [actionResorce, collections, resourceKey, rpcData])

  return addToCollectionButtonProps
}
