/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../lib/types'
import { orgInfo } from '../../model/org/types'
import { userRole } from '../../model/user-home/types'
import type * as moo from '../../moodle-domain'
import { userSummary } from './types'
import { flags } from '@moodle/lib-types'

declare module '../../moodle-domain' {
  interface Personas {
    orgAdmin: OrgAdminPersona
  }
}

export type OrgAdminPersona = moo.DefPersona<{
  useCase: {
    userManagement: UserManagement
    orgManagement: OrgManagement
  }
  model: OrgAdminModel
}>

export type UserManagement = moo.DefUseCase<{
  searchUsers: [{ textSearch: string }, { users: { id: string; userSummary: userSummary; cursor: string }[] }]
  editRoles: [{ userId: string; edit: 'add' | 'remove'; roles: userRole[] }, Either<NOT_FOUND, { updatedRoles: userRole[] }>]
  deactivateUser: [{ userId: string; reason: string; anonymize: boolean }, Either<NOT_FOUND, 'submitted'>]
}>

export type OrgManagement = moo.DefUseCase<{
  getOrgInfo: [void, { orgInfo: orgInfo }]
  editOrgInfo: [{ orgInfo: orgInfo }, void]
}>

export type OrgAdminModel = moo.DefModel<{
  userSummaries: moo.IdSpaceMap<
    userSummary,
    { match: { text: string; on?: flags<'email' | 'name'> } },
    {
      deactivate: ['async', { reason: string; anonymize: boolean }, Either<NOT_FOUND, 'submitted'>]
      editRole: ['sync', { edit: 'add' | 'remove'; roles: userRole[] }, Either<NOT_FOUND, 'submitted'>]
    }
  >
  orgInfo: moo.StaticData<'w', orgInfo>
}>
