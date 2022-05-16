import { t } from '@lingui/macro'
import { isOfNodeType } from '@moodlenet/common/dist/graphql/helpers'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { mixed, object, SchemaOf, string } from 'yup'
import { MNEnv } from '../../../../../constants'
// import { useSession } from '../../../../../context/Global/Session'
import { useUploadTempFile } from '../../../../../helpers/data'
import { useUnsplash } from '../../../../../helpers/unsplash'
import { useAutoImageAdded } from '../../../../../helpers/utilities'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewCollectionProps } from '../NewCollection'
import { NewCollectionFormValues } from '../types'
import { useCreateCollectionMutation } from './NewCollectionCtrl.gen'

const validationSchema: SchemaOf<NewCollectionFormValues> = object({
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
  title: string()
    .max(160)
    .min(3)
    .required(t`Please provide a title`),
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
          })
        : true
    )
    .optional(),
  visibility: mixed().required(t`Visibility is required`),
})

export type NewCollectionCtrlProps = {}

export const useNewCollectionCtrl: CtrlHook<
  NewCollectionProps,
  NewCollectionCtrlProps
> = () => {
  const autoImageAdded = useAutoImageAdded()

  const { getImageFromKeywords } = useUnsplash()
  const history = useHistory()
  const uploadTempFile = useUploadTempFile()
  // const { refetch } = useSession()
  const [createCollectionMut /* , createCollectionMutRes */] =
    useCreateCollectionMutation()
  // const [createCollectionRelMut /* , createCollectionRelMutRes */] = useCreateCollectionRelationMutation()

  const setNewRandomImage = async (
    name: string,
    description: string
  ): Promise<AssetRefInput> => {
    const assetInfo = await getImageFromKeywords(name, description)
    const assetRefInput: AssetRefInput = assetInfo
      ? {
          ...assetInfo,
          type: 'ExternalUrl',
        }
      : { location: '', type: 'NoAsset' }
    return assetRefInput
  }

  const form = useFormik<NewCollectionFormValues>({
    validationSchema,
    initialValues: {
      description: '',
      image: null,
      title: '',
      visibility: 'Private',
    },
    onSubmit: async ({ description, title, visibility, image }) => {
      let isAutoImageAdded = false
      const imageAssetRef: AssetRefInput = !image
        ? ((isAutoImageAdded = true),
          await setNewRandomImage(title, description))
        : typeof image === 'string'
        ? {
            location: image,
            type: 'ExternalUrl',
          }
        : image.location instanceof File
        ? {
            location: await uploadTempFile('image', image.location),
            type: 'TmpUpload',
          }
        : ((isAutoImageAdded = true),
          await setNewRandomImage(title, description))
      const collectionCreationResp = await createCollectionMut({
        variables: {
          res: {
            nodeType: 'Collection',
            Collection: {
              description,
              image: imageAssetRef,
              name: title,
              _published: visibility === 'Public',
            },
          },
        },
      })
      const createRespData = collectionCreationResp.data?.collection
      if (
        !(
          createRespData?.__typename === 'CreateNodeMutationSuccess' &&
          isOfNodeType(['Collection'])(createRespData.node)
        )
      ) {
        form.setErrors({
          title: `couldn't create: ${
            createRespData?.__typename === 'CreateNodeMutationError'
              ? createRespData.details
              : ''
          }`,
        })
        return
      }
      const collId = createRespData.node.id
      // refetch()
      history.push(
        nodeGqlId2UrlPath(collId),
        autoImageAdded.set(isAutoImageAdded)
      )
    },
  })

  const NewCollectionProps = useMemo<NewCollectionProps>(() => {
    const props: NewCollectionProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      stepProps: {
        step: 'CreateCollectionStep',
        form,
      },
    }
    return props
  }, [form])

  return NewCollectionProps && [NewCollectionProps]
}
