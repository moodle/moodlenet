import { isOfNodeType } from '@moodlenet/common/dist/graphql/helpers'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { useSession } from '../../../../../context/Global/Session'
import { useUploadTempFile } from '../../../../../helpers/data'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { NewCollectionProps } from '../NewCollection'
import { NewCollectionFormValues } from '../types'
import { useCreateCollectionMutation } from './NewCollectionCtrl.gen'

export type NewCollectionCtrlProps = {}

export const useNewCollectionCtrl: CtrlHook<
  NewCollectionProps,
  NewCollectionCtrlProps
> = () => {
  const history = useHistory()
  const uploadTempFile = useUploadTempFile()
  const { refetch } = useSession()
  const [createCollectionMut /* , createCollectionMutRes */] =
    useCreateCollectionMutation()
  // const [createCollectionRelMut /* , createCollectionRelMutRes */] = useCreateCollectionRelationMutation()

  const form = useFormik<NewCollectionFormValues>({
    initialValues: {
      description: '',
      image: null,
      title: '',
      visibility: 'Private',
    },
    onSubmit: async ({ description, title, visibility, image }) => {
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
        createRespData?.__typename === 'CreateNodeMutationSuccess' &&
        isOfNodeType(['Collection'])(createRespData.node)
      ) {
        const collId = createRespData.node.id

        const waitFor: Promise<any>[] = []

        await Promise.all(waitFor).finally(refetch)

        history.push(nodeGqlId2UrlPath(collId))
      }
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
