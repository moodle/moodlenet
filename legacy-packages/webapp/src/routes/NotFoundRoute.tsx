import { FC } from 'react'
import { Fallback } from '../ui/components/pages/Extra/Fallback/Fallback'
import { useHeaderPageTemplateCtrl } from '../ui/components/templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ctrlHook } from '../ui/lib/ctrl'

export const NotFoundRouteComponent: FC = () => {
  const headerPageTemplateProps = ctrlHook(
    useHeaderPageTemplateCtrl,
    {},
    'header-page not-found'
  )
  return <Fallback headerPageTemplateProps={headerPageTemplateProps} />
}

export const NotFoundRoute = {
  component: NotFoundRouteComponent,
}
