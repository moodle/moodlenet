// import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'
import { CircularProgress } from '@material-ui/core'
import Lottie from 'lottie-react'
import type { FC } from 'react'
import uploadingAnimation from '../../../assets/animations/uploading.json' //@ALE //@ETTO I tried adding {"resolveJsonModule": true, "esModuleInterop": true} to the compilerOptions of tsconfig.json of this package, but it keeps throwing the build error.
import './Loading.scss'

export type LoadingProps = {
  color?: 'white' | 'orange' | string
  size?: string
  type?: 'circular' | 'uploading'
}

// const colorPalete = {
//   orange: '#f88012',
//   white: '#fff',
// }

export const Loading: FC<LoadingProps> = ({ color, size, type }) => {
  const style = { '--loading-color': color } as React.CSSProperties

  return (
    <>
      {type === 'circular' && (
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
      )}
      {type === 'uploading' && (
        <Lottie //@ALE //@ETTO this display a build error but I actually works well in the app
          className="loading uploading-progress"
          animationData={uploadingAnimation}
          loop={true}
          style={{ width: size, height: size }}
        />
      )}
    </>
  )
}

Loading.defaultProps = {
  color: 'orange',
  size: '18px',
  type: 'circular',
}

export default Loading
