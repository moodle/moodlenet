// import type { EmailLayoutProps } from '@moodlenet/component-library'
// import { EmailLayout } from '@moodlenet/component-library'
// import { getUserLevelDetails } from '../../../gamification/user-levels.mjs'

// export type LevelUpEmailProps = Partial<EmailLayoutProps> & {
//   instanceName: string
//   points: number
// }

// export const LevelUpEmail = ({ instanceName, points, actionUrl }: LevelUpEmailProps) => {
//   const { level, title: levelTitle, minPoints, avatar } = getUserLevelDetails(points)
//   const subject = `You are now a Level ${level} ${levelTitle} 🎉`
//   const title = ` You've just levelled up to a ${levelTitle} 🌟`

//   const content = (
//     <>
//       Congratulations, you&apos;ve reached <b>Level {level}</b>!
//       <br />
//       Your contributions on {instanceName} have earned you at least <b>{minPoints} points</b>.
//       <div style={logoContainerStyle}>
//         <img
//           src={avatar}
//           alt={`Avatar image of the level ${level} ${levelTitle}`}
//           style={logoStyle}
//         />
//       </div>
//       <b>Keep contributing</b> to reach the next level.
//     </>
//   )

//   return (
//     <EmailLayout
//       subject={subject}
//       content={content}
//       title={title}
//       actionTitle={`Check my progress`}
//       actionUrl={actionUrl}
//     />
//   )
// }

// LevelUpEmail.defaultProps = {
//   instanceName: 'MoodleNet',
//   points: 20,
// } as LevelUpEmailProps

// export default LevelUpEmail

// const logoContainerStyle = {
//   display: 'block',
//   width: '150px',
//   height: '150px',
//   margin: '15px auto',
//   borderRadius: '50%',
//   padding: '10px',
//   backgroundImage:
//     'radial-gradient(circle, rgba(175,175,175,1) 10%, rgba(175,175,175,1) 28%, #ffffff00 67%, #ffffff00 108%)',
// }

// const logoStyle = {
//   backgroundColor: 'white',
//   borderRadius: '50%',
//   width: '100%',
//   height: '100%',
// }
