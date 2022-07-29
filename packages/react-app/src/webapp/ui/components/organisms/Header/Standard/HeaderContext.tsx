// import {
//   ComponentType,
//   createContext,
//   FC,
//   PropsWithChildren,
//   ReactNode,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react'
// export type AvatarMenuItemDef = {
//   Text: string
//   Icon: ComponentType | ReactNode
//   Path?: string
//   OnClick?: () => unknown

import { ReactNode } from 'react'

// }
export type AvatarMenuItem = { def: AvatarMenuItemDef }
export type AvatarMenuItemDef = { Text: string; Icon: ReactNode; Path?: string; OnClick?: () => unknown }
// // export type AvatarMenuItem = { def: AvatarMenuItemDef }
// export type HeaderCtxT = {
//   avatarMenuItems: AvatarMenuItem[]
//   registerAvatarMenuItem(avatarMenuItem: AvatarMenuItemDef): void
// }

// export const HeaderCtx = createContext<HeaderCtxT>(null as any)

// export function useRegisterAvatarMenuItem({ Text, Icon, Path, OnClick }: AvatarMenuItemDef) {
//   const registerAvatarMenuItem = useContext(HeaderCtx).registerAvatarMenuItem
//   useEffect(() => {
//     return registerAvatarMenuItem({ Text, Icon, Path, OnClick })
//   }, [registerAvatarMenuItem, Text, Icon, Path, OnClick])
// }

// export const Provider: FC<PropsWithChildren<{}>> = ({ children }) => {
//   // const nav = useNavigate()
//   const [avatarMenuItems, setAvatarMenuItems] = useState<HeaderCtxT['avatarMenuItems']>([])
//   const registerAvatarMenuItem = useCallback<HeaderCtxT['registerAvatarMenuItem']>(avatarMenuItemDef => {
//     const avatarMenuItem: AvatarMenuItem = {
//       def: avatarMenuItemDef,
//     }
//     setAvatarMenuItems(items => [...items, avatarMenuItem])
//     return remove
//     function remove() {
//       setAvatarMenuItems(items => items.filter(_ => _ !== avatarMenuItem))
//     }
//   }, [])

//   const ctx = useMemo<HeaderCtxT>(() => {
//     return {
//       avatarMenuItems,
//       registerAvatarMenuItem,
//     }
//   }, [avatarMenuItems, registerAvatarMenuItem])

//   return <HeaderCtx.Provider value={ctx}>{children}</HeaderCtx.Provider>
// }
