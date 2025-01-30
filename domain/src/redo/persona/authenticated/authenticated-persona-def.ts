/* eslint-disable @typescript-eslint/no-invalid-void-type */

import type { email_address, signed_expire_token } from '@moodle/lib-types'
import { date_time_string } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import type { Option } from 'fp-ts/Option'
import { password_hash } from '../../../modules/crypto'
import { eduCollectionData, eduResourceData } from '../../../modules/edu'
import { assetProcessStatus, profileInfo } from '../../../modules/user-profile'
import { INVALID_TOKEN, NOT_FOUND } from '../../lib/types'
import type {
  changePasswordForm,
  eduCollectionDraft,
  eduResourceDraft,
  loginForm,
  resetPasswordForm,
  useProfileImageForm,
} from '../../model/user-home/types'
import type * as moo from '../../moodle-domain'
import { eduCollectionMetaForm } from '../edu'
import { draftBasicMeta, eduInterestFields, userAccountData } from './types'

declare module '../../moodle-domain' {
  interface Personas {
    authenticated: AuthenticatedPersona
  }
}

export type AuthenticatedPersona = moo.DefPersona<{
  useCase: {
    // configs:{getAll[schemas|configs]}
    accessSystem: AccessSystem
    manageMyAccount: ManageMyAccount
    curateMyProfile: CurateMyProfile
    curateMyDraftCollections: CurateMyDraftCollections
    curateMyDraftResources: CurateMyDraftResources
  }
  model: UserHomeModel
}>

export type AccessSystem = moo.DefUseCase<{
  loginWithEmailAndPassword: [{ loginForm: loginForm }, Option<{ sessionToken: signed_expire_token }>]
  logout: [void, void]
  lostMyPassword: [{ myEmail: email_address }, void]
  resetMyPassword: [{ resetPasswordForm: resetPasswordForm }, Either<NOT_FOUND | INVALID_TOKEN, 'done'>]
  // ????????????? getMyUserSession: [void, { userSession: userSession }]
}>

export type ManageMyAccount = moo.DefUseCase<{
  wantToDeleteMyAccount: [void, void]
  changeMyPassword: [changePasswordForm, Either<'wrongCurrentPassword', 'done'>]
}>

export type CurateMyProfile = moo.DefUseCase<{
  setMyImage: [{ useProfileImageForm: useProfileImageForm }, adoptAssetResult]
  editInfo: [{ profileInfoMeta: profileInfo }, void]
}>

export type CurateMyDraftCollections = moo.DefUseCase<{
  create: [{ eduCollectionMetaForm: eduCollectionMetaForm }, { eduCollectionDraftId: string }]
  edit: [{ eduCollectionDraftId: string; eduCollectionMetaForm: eduCollectionMetaForm }, void]
  get: [{ eduCollectionDraftId: string }, Option<{ eduCollectionDraft: eduCollectionDraft }>]
  applyImage: [{ eduCollectionDraftId: string; applyImageForm: eduCollectionApplyImageForm }, adoptAssetResult]
}>

export type CurateMyDraftResources = moo.DefUseCase<{
  create: [{ createNewEduResourceDraftSchemaForm: createNewEduResourceDraftSchemaForm }, { eduResourceDraftId: string }]
  edit: [{ eduResourceDraftId: string; eduResourceMetaForm: eduResourceMetaForm }, void]
  get: [{ eduResourceDraftId: string }, Option<{ eduResourceDraft: eduResourceDraft }>]
  applyImage: [{ eduResourceDraftId: string; applyImageForm: eduResourceApplyImageForm }, adoptAssetResult]
}>

export type UserHomeModel = moo.DefModel<{
  home: moo.IdSpaceMap<{
    vault: { passwordHash: password_hash }
    myAccount: moo.EntityData<'r', userAccountData>
    myProfile: {
      info: moo.EntityData<'w', profileInfo>
      background: moo.Asset<{ optional: true }>
      avatar: moo.Asset<{ optional: true }>
      preferences: moo.EntityData<'w', { eduInterestFields: eduInterestFields }>
    }
    myDrafts: {
      eduResources: moo.IdSpaceMap<
        draftBasicMeta & {
          data: moo.EntityData<'w', eduResourceData>
          asset: moo.Asset<{ optional: false }>
          background: moo.Asset<{ optional: true }>
          assetProcessStatus: assetProcessStatus
        }
      >
      eduCollections: moo.IdSpaceMap<
        draftBasicMeta & {
          data: moo.EntityData<'w', eduCollectionData>
          background: moo.Asset<{ optional: true }>
          resources: {
            myDrafts: { addDate: date_time_string; id: string }[]
            onMoodlenet: { addDate: date_time_string; id: string }[]
          }
        }
      >
    }
  }>
}>

export type PPP = {
  persona: {
    [persona: string]: {
      module: {
        [module: string]: {
          config: unknown
          scope: {
            [scope: string]: {
              config: unknown
              subScope: {
                [subScope: string]: {
                  config: unknown
                  useCase: {
                    curateMyDraftCollections: CurateMyDraftCollections
                    curateMyDraftResources: CurateMyDraftResources
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
