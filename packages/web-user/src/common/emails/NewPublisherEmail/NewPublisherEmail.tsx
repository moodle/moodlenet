// import type { EmailLayoutProps } from '@moodlenet/component-library'
// import { EmailLayout } from '@moodlenet/component-library'

// export type NewPublisherEmailProps = Partial<EmailLayoutProps> & {
//   instanceName: string
// }

// export const NewPublisherEmail = ({ instanceName, actionUrl }: NewPublisherEmailProps) => {
//   const title = `Your are now a ${instanceName} publisher! 🌟`
//   const content = (
//     <>
//       Congratulations! This upgrade reflects your active engagement in upholding our
//       community&apos;s quality and integrity.
//       <br />
//       <br />
//       As a valued publisher, apart from making your content public, you can also flag users that
//       don&apos;t align to {instanceName} values.
//       <br />
//       <br />
//       By contributing, you increase the recognition and reach of your content, making the education
//       world better.
//     </>
//   )

//   return (
//     <EmailLayout
//       subject={title}
//       content={content}
//       title={title}
//       actionTitle={`Keep contributing`}
//       actionUrl={actionUrl}
//     />
//   )
// }

// NewPublisherEmail.defaultProps = {
//   instanceName: 'MoodleNet',
// } as NewPublisherEmailProps

// export default NewPublisherEmail
