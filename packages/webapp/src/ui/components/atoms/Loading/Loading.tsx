import { FC } from 'react'
import './styles.scss'

export type LoadingProps = {
  color?: 'orange' | 'white'
}

export const Loading: FC<LoadingProps> = ({ color }) => {
  const style = { '--loading-color': color } as React.CSSProperties
  return (
    <div className={`loading `} style={style}>
      <div className="stage">
        <div className="dot-flashing"></div>
      </div>
    </div>
  )
}

Loading.defaultProps = {
  color: 'orange',
}

export default Loading
