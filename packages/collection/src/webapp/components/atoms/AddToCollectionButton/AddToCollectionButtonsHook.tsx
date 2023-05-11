import type { OptionItemProp } from '@moodlenet/component-library'
import type { SelectOptionsMulti } from '@moodlenet/react-app/ui'
import { useContext, useEffect, useMemo, useState } from 'react'
import type { CollectionsResorce } from '../../../../common/types.mjs'
import { MainContext } from '../../../MainContext.js'
import type { AddToCollectionButtonProps } from './AddToCollectionButtons.js'

type Action = 'remove' | 'add'
const empityOptions: SelectOptionsMulti<OptionItemProp> = { opts: [], selected: [] }
const isCollectionIdEqual = (collectionId: string) => (el: CollectionsResorce) =>
  el.collectionKey === collectionId

const collectionToProps = (res: CollectionsResorce[]): SelectOptionsMulti<OptionItemProp> =>
  res.reduce((acc, el) => {
    const item = {
      value: el.collectionKey,
      label: el.collectionName,
    }
    return {
      opts: [...acc.opts, item],
      selected: el.hasResource ? [...acc.selected, item] : acc.selected,
    }
  }, empityOptions)

export const useAddToCollectionButtons = (resourcenKey: string): AddToCollectionButtonProps => {
  const [rpcData, setRpcData] = useState<CollectionsResorce[] | null>(null)
  const { rpcCaller } = useContext(MainContext)

  useEffect(() => {
    rpcCaller.collectionsResorce(resourcenKey).then(res => setRpcData(res))
  }, [resourcenKey, rpcCaller])

  const hook = useMemo(() => {
    const setterCollections = (action: Action, collectionId: string) => () => {
      const isCollectionId = isCollectionIdEqual(collectionId)
      const current = rpcData && rpcData.find(isCollectionId)
      if (!rpcData || !current) return

      const dataExlucdeCurrent = rpcData.filter(el => !isCollectionId(el))
      const hasResource = action === 'add' || action === 'remove' || current.hasResource
      setRpcData([...dataExlucdeCurrent, { ...current, hasResource }])
    }

    const actions = (action: Action) => (collectionKey: string) => {
      rpcCaller
        .actionResorce(collectionKey, action, resourcenKey)
        .then(setterCollections(action, collectionKey))
    }

    return {
      add: actions('add'),
      remove: actions('remove'),
      collections: rpcData ? collectionToProps(rpcData) : empityOptions,
    }
  }, [resourcenKey, rpcCaller, rpcData])

  return hook
}
