"use client"
// import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress'
import { CircularProgress } from '@mui/material'
import Lottie from 'lottie-react'
import type { FC } from 'react'
import uploadingAnimation from '../../../assets/animations/uploading.mjs'
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
        //@ts-expect-error: because of lottie-react type signature
        <Lottie
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
