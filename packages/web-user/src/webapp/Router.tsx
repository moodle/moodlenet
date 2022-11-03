import { Route } from 'react-router-dom'
import ProfilePage from './components/pages/Profile/Profile.js'
// import { getProfileStoryProps } from './components/pages/Profile/stories-props.js'

// export default () => {
// const props = fakeProfilePageProps
//   return (
// <Route
//   path="props.profileUrl"
//   element={
//     <Suspense fallback="loading...">
//       <ProfilePage {...props} />
//     </Suspense>s
//   }/>
// )
// }

export default (
  <Route index element={<ProfilePageCtrl />} />
  // <Route path={fakeProfilePageProps.profileCardProps.profileUrl} element={<ProfilePage {...fakeProfilePageProps} />} />
)
