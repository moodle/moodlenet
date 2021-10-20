import { FC } from 'react'
import { FallbackPage } from '../ui/components/pages/FallbackPage/FallbackPage'
import { useHeaderPageTemplateCtrl } from '../ui/components/templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ctrlHook } from '../ui/lib/ctrl'

export const NotFoundRouteComponent: FC = () => {
  const headerPageTemplateProps = ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page not-found')
  return <FallbackPage headerPageTemplateProps={headerPageTemplateProps} />
}

export const NotFoundRoute = {
  component: NotFoundRouteComponent,
}
