// import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'
import { CircularProgress } from '@material-ui/core'
import type { FC } from 'react'
import './Loading.scss'

export type LoadingProps = {
  color?: 'white' | 'orange' | string
  size?: number
}

// const colorPalete = {
//   orange: '#f88012',
//   white: '#fff',
// }

export const Loading: FC<LoadingProps> = ({ color, size }) => {
  const style = { '--loading-color': color } as React.CSSProperties
  return (
    <div className={`loading circular-progress`} style={style}>
      <CircularProgress
        variant="indeterminate"
        // sx={{
        //   color: color && colorPalete[color] ? colorPalete[color] : '#fff',
        //   animationDuration: '1500ms',
        //   [`& .${circularProgressClasses.circle}`]: {
        //     strokeLinecap: 'round',
        //   },
        // }}
        size={size}
        style={{ color: color }}
        thickness={6}
      />
    </div>
    // <div className={`loading dot-flashing `} style={style}>
    //   <div className="stage">
    //     <div className="dot-flashing"></div>
    //   </div>
    // </div>
  )
}

Loading.defaultProps = {
  color: 'orange',
  size: 18,
}

export default Loading
