// import { USER, UserStatus } from '../types'
// export const deleteNewUserRequestQ = ({ token }: { token: string }) => `
//     FOR user IN ${USER}
//       FILTER user.firstActivationToken == ${token}
//           && user.status == ${UserStatus.WaitingFirstActivation}
//       LIMIT 1
//       REMOVE user IN ${USER}
//       RETURN null
//   `
