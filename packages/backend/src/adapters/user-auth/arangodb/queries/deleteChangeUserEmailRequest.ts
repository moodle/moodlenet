// import { USER } from '../types'
// export const deleteChangeUserEmailRequestQ = ({ token }: { token: string }) => `
//     FOR user IN ${USER}
//       FILTER user.changeEmailRequest.token == ${token}
//       LIMIT 1
//         UPDATE user WITH {
//           changeEmailRequest: null
//         } IN ${USER}
//       RETURN null
//   `
