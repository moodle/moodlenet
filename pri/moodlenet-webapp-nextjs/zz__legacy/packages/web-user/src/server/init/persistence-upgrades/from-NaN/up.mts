import { addTextSearchFields } from '@moodlenet/system-entities/server'
import { Profile } from '../../sys-entities.mjs'

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const [deleteAccountConfirmationTemplate, messageFromUserTemplate] = await Promise.all(
//   ['delete-account-confirmation', 'message-from-user'].map(async templateFileName =>
//     readFile(
//       resolve(
//         __dirname,
//         '..',
//         '..',
//         '..',
//         '..',
//         '..',
//         `user-messages-templates/${templateFileName}.html`,
//       ),
//       'utf-8',
//     ),
//   ),
// )
// assert(deleteAccountConfirmationTemplate && messageFromUserTemplate)

// kvStore.set('message-templates' as any, '', {
//   messageFromUser: messageFromUserTemplate,
//   deleteAccountConfirmation: deleteAccountConfirmationTemplate,
// })

await addTextSearchFields(Profile.collection.name, ['displayName', 'aboutMe'])

export default 1
