import { FC } from 'react'
import { ctrlHook } from '../ui/lib/ctrl'
import { FallbackPage } from '../ui/pages/FallbackPage/FallbackPage'
import { useHeaderPageTemplateCtrl } from '../ui/templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'

export const NotFoundRouteComponent: FC = () => {
  const headerPageTemplateProps = ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page not-found')
  return <FallbackPage headerPageTemplateProps={headerPageTemplateProps} />
}

export const NotFoundRoute = {
  component: NotFoundRouteComponent,
}
