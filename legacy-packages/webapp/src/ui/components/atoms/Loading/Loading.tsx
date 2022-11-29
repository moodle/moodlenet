import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress'
import { FC } from 'react'
import './styles.scss'

export type LoadingProps = {
  color?: 'white' | 'orange'
  size?: number
}

const colorPalete = {
  orange: '#f88012',
  white: '#fff',
}

export const Loading: FC<LoadingProps> = ({ color, size }) => {
  const style = { '--loading-color': color } as React.CSSProperties
  return (
    <div className={`loading circular-progress`} style={style}>
      <CircularProgress
        variant="indeterminate"
        sx={{
          color: color && colorPalete[color] ? colorPalete[color] : '#fff',
          animationDuration: '1500ms',
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={size}
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
