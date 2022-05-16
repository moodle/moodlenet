import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { Bookmarks } from '../ui/components/pages/Bookmarks/Bookmarks'
import { useBookmarksCtrl } from '../ui/components/pages/Bookmarks/Ctrl/BookmarksCtrl'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const BookmarksRouteComponent: RouteFC<
  Routes.BookmarksPage
> = (/* { match } */) => {
  const props = ctrlHook(useBookmarksCtrl, {}, 'bookmarks-route')
  return <Bookmarks {...props} />
}

export const BookmarksRoute: MNRouteProps<Routes.BookmarksPage> = {
  component: BookmarksRouteComponent,
  path: '/bookmarks',
  exact: true,
}
