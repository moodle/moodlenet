import { Route } from 'react-router-dom'
import { fakeProfilePageProps } from './fakeData'
import ProfilePage from './ProfilePage/ProfilePage_orig_Bru'

// export default () => {
// const props = fakeProfilePageProps
//   return (
// <Route
//   path="props.profileUrl"
//   element={
//     <Suspense fallback="loading...">
//       <ProfilePage {...props} />
//     </Suspense>
//   }/>
// )
// }

export default (
  <Route index element={<ProfilePage {...fakeProfilePageProps} />} />
  // <Route path={fakeProfilePageProps.profileCardProps.profileUrl} element={<ProfilePage {...fakeProfilePageProps} />} />
)
