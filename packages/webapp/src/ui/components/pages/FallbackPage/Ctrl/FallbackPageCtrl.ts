// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FallbackPageProps } from '../FallbackPage'

export type FallbackPageCtrlProps = {}
export const useFallbackPageCtrl: CtrlHook<FallbackPageProps, FallbackPageCtrlProps> = () => {
  return [fallbackPageProps({ key: 'fallback-page' })]
}

export const fallbackPageProps = ({ key }: { key: string }): FallbackPageProps => {
  return {
    headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, `${key}-header-page-template`),
  }
}
