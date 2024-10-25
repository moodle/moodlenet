// import { ArrowDropDown } from '@mui/icons-material'
// import { AddonItem, FloatingMenu, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
// import { FC } from 'react'

// // export type FilterProps = {
// //   name: string
// //   menuContent: React.ReactElement[] | React.ReactElement
// //   menuContentType?: 'menu-content-default-list' | string
// //   key: number | string
// //   isUsed?: boolean
// // }

// export const Filter: FC<AddonItem> = ({ key, menuContent, name, isUsed, menuContentType }) => {
//   return (
//     <FloatingMenu
//       key={key}
//       className={`${menuContentType}`}
//       hoverElement={
//         isUsed ? (
//           <PrimaryButton className={`filter-element ${isUsed ? 'selected' : ''}`}>
//             {name}
//             <ArrowDropDown />
//           </PrimaryButton>
//         ) : (
//           <SecondaryButton className={`filter-element ${isUsed ? 'selected' : ''}`} color="grey">
//             {name}
//             <ArrowDropDown />
//           </SecondaryButton>
//         )
//       }
//       menuContent={menuContent}
//     />
//   )
// }

// export type FilterMenuElementProps = {
//   name: string
//   key: string | number
//   isCurrent?: boolean
//   onClick?: () => unknown
// }

// export const FilterMenuElement: FC<FilterMenuElementProps> = ({
//   key,
//   name,
//   isCurrent,
//   onClick,
// }) => {
//   return (
//     <div
//       key={key}
//       className={`section ${isCurrent ? 'selected' : ''}`}
//       onClick={onClick && onClick}
//     >
//       <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
//         <div className={`border ${isCurrent ? 'selected' : ''}`} />
//       </div>
//       <div className={`content ${isCurrent ? 'selected' : ''}`}>{name}</div>
//     </div>
//   )
// }

export const getFilterContentDefaultListElement = (element: {
  name: string
  key: string | number
  onClick?: () => unknown
  isCurrent?: boolean
}) => {
  const { name, key, isCurrent, onClick } = element
  return (
    <div
      key={key}
      className={`section ${isCurrent ? 'selected' : ''}`}
      onClick={element.onClick && onClick}
    >
      <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
        <div className={`border ${isCurrent ? 'selected' : ''}`} />
      </div>
      <div className={`content ${isCurrent ? 'selected' : ''}`}>
        <span>{name}</span>
      </div>
    </div>
  )
}
