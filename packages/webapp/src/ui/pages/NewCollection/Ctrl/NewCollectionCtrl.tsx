import { AssetRefInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { nodeId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { useUploadTempFile } from '../../../../helpers/data'
import { categoriesOptions, getIscedF } from '../../../../helpers/resource-relation-data-static-and-utils'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewCollectionProps } from '../NewCollection'
import { NewCollectionFormValues } from '../types'
import { useCreateCollectionMutation, useCreateCollectionRelationMutation } from './NewCollectionCtrl.gen'

export type NewCollectionCtrlProps = {}

export const useNewCollectionCtrl: CtrlHook<NewCollectionProps, NewCollectionCtrlProps> = () => {
  const history = useHistory()
  const uploadTempFile = useUploadTempFile()
  const [createCollectionMut /* , createCollectionMutRes */] = useCreateCollectionMutation()
  const [createCollectionRelMut /* , createCollectionRelMutRes */] = useCreateCollectionRelationMutation()

  const [, /* form */ formBag] = useFormikBag<NewCollectionFormValues>({
    initialValues: {
      description: '',
      image: null,
      title: '',
      category: '',
    },
    onSubmit: console.log.bind(console, 'submit NewCollection'),
  })

  const [sform] = formBag

  const { image, category, description, title } = sform.values

  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    const imageObjectUrl = image instanceof File ? URL.createObjectURL(image) : ''
    setImageUrl(imageObjectUrl)
    return () => URL.revokeObjectURL(imageObjectUrl)
  }, [image, setImageUrl])

  const save = useCallback(async () => {
    if (!(title && description)) {
      return
    }
    const imageAssetRef: AssetRefInput = !image
      ? { location: '', type: 'NoAsset' }
      : typeof image === 'string'
      ? {
          location: image,
          type: 'ExternalUrl',
        }
      : {
          location: await uploadTempFile('image', image),
          type: 'TmpUpload',
        }
    const collectionCreationResp = await createCollectionMut({
      variables: {
        res: {
          nodeType: 'Collection',
          Collection: { description, image: imageAssetRef, name: title },
        },
      },
    })
    const collection = collectionCreationResp.data?.collection
    if (collection?.__typename === 'CreateNodeMutationSuccess' && collection.node.__typename === 'Collection') {
      const collId = collection.node.id

      const waitFor: Promise<any>[] = []
      if (category) {
        const { iscedFId } = getIscedF(category)
        waitFor.push(
          createCollectionRelMut({
            variables: { edge: { edgeType: 'Features', from: collId, to: iscedFId, Features: {} } },
          }),
        )
      }

      await Promise.all(waitFor)
      history.push(nodeId2UrlPath(collId))
    }
  }, [category, createCollectionMut, createCollectionRelMut, description, history, image, title, uploadTempFile])

  const NewCollectionProps = useMemo<NewCollectionProps>(() => {
    const props: NewCollectionProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      stepProps: {
        step: 'CreateCollectionStep',
        categories: categoriesOptions,
        imageUrl,
        formBag,
        finish: title && description ? save : undefined,
      },
    }
    return props
  }, [imageUrl, formBag, title, description, save])

  // console.log({ vals: form.values, step: NewCollectionProps.stepProps })

  return NewCollectionProps && [NewCollectionProps]
}
