import InstallExtension, { InstallExtensionMenu } from './InstallExtension.js'

// export const MenuComponent: FC = () => {
//   const { setSelectedExtInfo } = useContext(MainContext)
//   return <span onClick={() => setSelectedExtInfo(null)}>Install extensions</span>
// }

export const SettingsInstallMenu = InstallExtensionMenu
// export const SettingsInstallMenu = <MenuComponent />
export const SettingsInstallContent = <InstallExtension />
