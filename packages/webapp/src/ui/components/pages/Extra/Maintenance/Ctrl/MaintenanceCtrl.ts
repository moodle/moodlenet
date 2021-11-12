// import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { useHeaderPageTemplateCtrl } from '../../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { MaintenanceProps } from '../Maintenance'

export type MaintenanceCtrlProps = {}
export const useMaintenanceCtrl: CtrlHook<MaintenanceProps, MaintenanceCtrlProps> = () => {
  return [maintenanceProps({ key: 'fallback-page' })]
}

export const maintenanceProps = ({ key }: { key: string }): MaintenanceProps => {
  return {
    headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, `${ key }-header-page-template`),
  }
}
