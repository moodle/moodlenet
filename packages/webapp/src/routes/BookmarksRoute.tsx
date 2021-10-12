import { Routes } from 'my-moodlenet-common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { Bookmarks } from '../ui/pages/Bookmarks/Bookmarks'
import { useBookmarksCtrl } from '../ui/pages/Bookmarks/Ctrl/BookmarksCtrl'
import { MNRouteProps, RouteFC } from './lib'

export const BookmarksRouteComponent: RouteFC<Routes.BookmarksPage> = (/* { match } */) => {
  const props = ctrlHook(useBookmarksCtrl, {}, 'bookmarks-route')
  return <Bookmarks {...props} />
}

export const BookmarksRoute: MNRouteProps<Routes.BookmarksPage> = {
  component: BookmarksRouteComponent,
  path: '/bookmarks',
  exact: true,
}
