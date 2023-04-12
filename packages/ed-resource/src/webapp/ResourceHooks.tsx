import debounce from 'lodash/debounce.js'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ResourceActions, ResourceFormProps, ResourceProps } from '../common.mjs'

import { MainContext } from './MainContext.js'

export type Actions = {
  editResource: (res: ResourceFormProps) => Promise<ResourceFormProps>
  getResource: () => Promise<ResourceProps>
  deleteResource: () => Promise<ResourceProps>
  toggleBookmark: () => Promise<ResourceProps>
  toggleLike: () => Promise<ResourceProps>
  setIsPublished: (approve: boolean) => Promise<ResourceProps>
}

export type ResourceCommonProps = {
  actions: ResourceActions
  props: ResourceProps
}
// type SaveState = { form: boolean; image: boolean; content: boolean }

type myProps = { resourceKey: string }
export const useResourceBaseProps = ({ resourceKey }: myProps) => {
  const { rpcCaller } = useContext(MainContext)
  const [resource, setResource] = useState<ResourceProps | null>()
  // const [saved] = useState<SaveState>({ form: false, image: false, content: false })

  useEffect(() => {
    rpcCaller.get(resourceKey).then(res => setResource(res))
  }, [resourceKey, rpcCaller, setResource])

  const actions = useMemo<ResourceActions>(() => {
    // const setterSave = (key: keyof SaveState, val: boolean) => setSaved({ ...saved, [key]: val })
    const { edit: editRpc, setImage, setIsPublished, setContent, _delete } = rpcCaller
    const edit = debounce(
      (res: ResourceFormProps) => editRpc(resourceKey, res).then(() => console.log('debouce', res)),
      1000,
    )
    const updateResource = <T,>(key: string, val: T): T => (
      resource && setResource({ ...resource, [key]: val }), val
    )
    const updateData =
      <T,>(key: string) =>
      (val: T) => (!resource ? '' : updateResource('data', { ...resource.data, [key]: val }), val)

    const resourceActions: ResourceActions = {
      async editData(res: ResourceFormProps) {
        console.log('edit xxx')
        edit(res) // .then(form => updateResource('form', 'resourceForm', form)),
      },
      async setImage(file: File) {
        return await setImage(resourceKey, file).then(updateData('imageUrl'))
      },
      setContent(content: File | string) {
        setContent(resourceKey, content).then(updateData('contentUrl'))
      },
      publish: () => setIsPublished(resourceKey, true),
      unpublish: () => setIsPublished(resourceKey, false),
      deleteResource: () => _delete(resourceKey),
    }
    return resourceActions
  }, [resource, resourceKey, rpcCaller])

  return useMemo<ResourceCommonProps | null>(
    () => (!resource ? null : { actions, props: resource }),
    [actions, resource],
  )
}
