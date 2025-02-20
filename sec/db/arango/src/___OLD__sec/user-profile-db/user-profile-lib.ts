import { unreachable_never } from '@moodle/lib-types'
import { eduCollectionDraft, eduResourceDraft, userProfileIdSelect, userProfileRecord } from '@moodle/module/user-profile'
import { aql } from 'arangojs'
import { AqlQuery, literal } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'

export async function overUserProfileById({
  dbStruct,
  userProfileIdSelect,
  apply = aql``,
  returns = 'userProfileDoc',
}: {
  dbStruct: dbStruct
  userProfileIdSelect: userProfileIdSelect
  apply?: AqlQuery
  returns?: 'userProfileDoc' | 'OLD' | 'NEW' // | any_other_string
}): Promise<userProfileRecord | null> {
  const getUserProfileAql = getMaybeUserProfileByIdSelectAql(userProfileIdSelect, dbStruct)

  const cursor = await dbStruct.appData.db.query(aql<userProfileRecord>`
      LET userProfileDoc = ${getUserProfileAql}
      ${apply}
      RETURN MOODLE::RESTORE_RECORD_ID(${literal(returns)})
    `)
  const [userProfile] = await cursor.all()
  return userProfile ?? null
}

export function getMaybeUserProfileByIdSelectAql(userProfileIdSelect: userProfileIdSelect, dbStruct: dbStruct) {
  return userProfileIdSelect.by === 'userProfileId'
    ? aql`(DOCUMENT(${dbStruct.appData.coll.userProfile}, ${userProfileIdSelect.userProfileId}))`
    : // aql`FOR userProfileDoc IN [DOCUMENT(${dbStruct.appData.coll.userProfile}, ${userProfileIdSelect.userProfileId})]
      //       FILTER userProfileDoc != null`
      userProfileIdSelect.by === 'userAccountId'
      ? aql`((FOR userProfileDoc IN ${dbStruct.appData.coll.userProfile}
                FILTER userProfileDoc.userAccount.id == ${userProfileIdSelect.userAccountId}
                LIMIT 1
                RETURN userProfileDoc)[0])`
      : unreachable_never(userProfileIdSelect)
}

export async function getDraft<draftType extends 'eduResource' | 'eduCollection'>({
  dbStruct,
  userProfileIdSelect,
  draftType,
  draftId,
}: {
  dbStruct: dbStruct
  userProfileIdSelect: userProfileIdSelect
  draftType: draftType
  draftId: string
}) {
  const userProfileRecord = await overUserProfileById({
    dbStruct,
    userProfileIdSelect: userProfileIdSelect,
  })
  return userProfileRecord?.myDrafts[draftType].find(draft => draft.draftId === draftId) as
    | undefined
    | (draftType extends 'eduResource' ? eduResourceDraft : draftType extends 'eduCollection' ? eduCollectionDraft : never)
}
// export async function updateUserProfileById({
//   dbStruct,
//   select,
//   partialUserProfile,
//   preCondition = aql``,
// }: {
//   select: userProfileIdSelect
//   dbStruct: dbStruct
//   partialUserProfile: deep_partial_props<userProfileRecord>
//   preCondition?: AqlQuery
// }) {
//   return overUserProfileById({
//     apply: aql`
//     ${preCondition}
//     UPDATE userProfileDoc WITH ${partialUserProfile} IN ${dbStruct.appData.coll.userProfile}`,
//     dbStruct,
//     select,
//   })
// }
