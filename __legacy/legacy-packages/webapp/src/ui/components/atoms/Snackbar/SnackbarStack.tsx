import './styles.scss'

export type SnackbarStackProps = {
  snackbarList: (React.ReactElement | null)[] | null
  className?: string
  position?: 'top' | 'bottom'
}

export const SnackbarStack: React.FC<SnackbarStackProps> = ({
  snackbarList,
  className,
  position,
}) => {
  return (
    <div className={`snackbar-stack ${className} position-${position}`}>
      {snackbarList &&
        snackbarList.map((snackbar, i) => {
          return (
            <div className="inside-snackbar" key={i}>
              {snackbar}
            </div>
          )
        })}
    </div>
  )
}

export default SnackbarStack

SnackbarStack.defaultProps = {
  position: 'bottom',
  className: '',
}
