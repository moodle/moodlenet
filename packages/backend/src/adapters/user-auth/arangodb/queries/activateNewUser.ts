// import { AuthId } from '@moodlenet/common/dist/content-graph/types/common'
// import { aq, aqlstr } from '../../../../lib/helpers/arango/query'
// import { ActiveUser, Status, WaitingFirstActivationUser } from '../../../../ports/user-auth/types'
// import { USER } from '../types'

// export const activateNewUserQ = ({ token, password, authId }: { authId: AuthId; token: string; password: string }) => {
//   const _fake_waiting = {} as WaitingFirstActivationUser
//   const activeUserPatch: ActiveUser = {
//     ..._fake_waiting,
//     password,
//     status: 'Active',
//     authId,
//   }
//   const WaitingFirstActivationStatus: Status = 'WaitingFirstActivation'
//   return aq<ActiveUser>(`
//     FOR user IN ${USER}

//       FILTER user.firstActivationToken == ${aqlstr(token)}
//         && user.status == ${aqlstr(WaitingFirstActivationStatus)}

//       LIMIT 1

//       let activeUser = MERGE(
//         UNSET( user, "firstActivationToken" ),
//         ${aqlstr(activeUserPatch)},
//         {
//           updatedAt: DATE_NOW()
//         }
//       )

//      // activeUser

//       UPDATE activeUser IN ${USER}

//     RETURN NEW
//   `)
// }
