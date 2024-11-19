// import ResourceClient from './resource.client'

import { access, getAuthenticatedUserSessionOrRedirectToLogin } from '../../../../lib/server/session-access'
import { params } from '../../../../lib/server/types'
import { Fallback } from '../../../../ui/pages/Fallback/Fallback'
import { ResourcePage, resourcePageProps } from '../../../../ui/pages/Resource/Resource'
import { editEduResourceDraftForId, getEduResourceDraftImageForIdAdoptAssetService } from '../eduResource-actions.server'

export default async function EditDraftResourcePage({ params: { eduResourceId } }: { params: params<'eduResourceId'> }) {
  await getAuthenticatedUserSessionOrRedirectToLogin()
  const [found, myEduResourceDraft] = await access.primary.userProfile.authenticated.getEduResourceDraft({
    eduResourceDraftId: eduResourceId,
  })
  if (!found) {
    return <Fallback />
  }
  const resourcePageProps: resourcePageProps = {
    activity: 'editDraft',
    allowedYears: [2020, 2021, 2022, 2023, 2024],
    actions: {
      // applyImage: null,
      editDraft: {
        saveMeta: await editEduResourceDraftForId({ eduResourceDraftId: eduResourceId }),
        applyImage: await getEduResourceDraftImageForIdAdoptAssetService({ eduResourceDraftId: eduResourceId }),
      },
      publish: null,
    },
    eduBloomCognitiveRecords: [],
    references: null,
    eduResourceData: myEduResourceDraft.data,
    contributorCardProps: null,
  }
  return <ResourcePage {...resourcePageProps} />
}
