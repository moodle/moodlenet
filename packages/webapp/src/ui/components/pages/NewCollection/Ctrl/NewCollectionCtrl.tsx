import { isOfNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { AssetRefInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'
import { useSession } from '../../../../../context/Global/Session'
import { useUploadTempFile } from '../../../../../helpers/data'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useFormikBag } from '../../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewCollectionProps } from '../NewCollection'
import { NewCollectionFormValues } from '../types'
import { useCreateCollectionMutation } from './NewCollectionCtrl.gen'

export type NewCollectionCtrlProps = {}

export const useNewCollectionCtrl: CtrlHook<NewCollectionProps, NewCollectionCtrlProps> = () => {
  const history = useHistory()
  const uploadTempFile = useUploadTempFile()
  const { refetch } = useSession()
  const [createCollectionMut /* , createCollectionMutRes */] = useCreateCollectionMutation()
  // const [createCollectionRelMut /* , createCollectionRelMutRes */] = useCreateCollectionRelationMutation()

  const [, /* form */ formBag] = useFormikBag<NewCollectionFormValues>({
    initialValues: {
      description: '',
      image: null,
      imageUrl: null,
      title: '',
    },
    onSubmit: console.log.bind(console, 'submit NewCollection'),
  })

  const [sform] = formBag

  const { image, description, title } = sform.values

  const [imageUrl, setImageUrl] = useState('')
  useEffect(() => {
    const imageObjectUrl = image instanceof File ? URL.createObjectURL(image) : ''
    setImageUrl(imageObjectUrl)
    return () => URL.revokeObjectURL(imageObjectUrl)
  }, [image, setImageUrl])

  const [saving, setSaving] = useState(false)
  const save = useCallback(async () => {
    if (!(title && description) || saving) {
      return
    }
    setSaving(true)

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
    const createRespData = collectionCreationResp.data?.collection
    if (
      createRespData?.__typename === 'CreateNodeMutationSuccess' &&
      isOfNodeType(['Collection'])(createRespData.node)
    ) {
      const collId = createRespData.node.id

      const waitFor: Promise<any>[] = []

      await Promise.all(waitFor).finally(() => {
        setSaving(false)
        refetch()
      })

      history.push(nodeGqlId2UrlPath(collId))
    }
  }, [refetch, createCollectionMut, description, history, image, saving, title, uploadTempFile])

  const NewCollectionProps = useMemo<NewCollectionProps>(() => {
    const props: NewCollectionProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      stepProps: {
        step: 'CreateCollectionStep',
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
