import { Route } from 'react-router-dom'
import { ProfileCtrl } from './components/pages/Profile/ProfileCtrl.js'

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

// <Route path={fakeProfilePageProps.profileCardProps.profileUrl} element={<ProfilePage {...fakeProfilePageProps} />} />

// export default { routes: <Route index element={<ProfilePageCtrl {...fakeProfilePageProps} />} /> }
export default { routes: <Route index element={<ProfileCtrl />} /> }
