// import { USER } from '../types'

// export const changeUserPasswordQ = ({
//   userId,
//   currentPassword,
//   newPassword,
// }: {
//   currentPassword: string
//   newPassword: string
//   userId: string
// }) => `
//     FOR user IN ${USER}
//     FILTER user.id == ${userId}
//         && user.password == ${currentPassword}
//     LIMIT 1
//     UPDATE user WITH {
//       password: ${newPassword}
//     } IN ${USER}
//     RETURN NEW
//   `
