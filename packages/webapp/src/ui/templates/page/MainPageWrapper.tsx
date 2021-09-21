import { FC } from 'react';
import useWhatInput from 'react-use-what-input';
import '../../styles/main.scss';
import '../../styles/view.scss';

export type MainPageWrapperProps = {
  onKeyDown?(arg0: unknown): unknown
}
export const MainPageWrapper: FC<MainPageWrapperProps> = ({ children, onKeyDown }) => {
  const [currentInput, currentIntent] = useWhatInput();

  return (
    <div className={`main-page-wrapper current-input-${currentInput} current-intent-${currentIntent}`} onKeyDown={onKeyDown}>
      {children}
    </div>
  )
}
MainPageWrapper.displayName = 'MainPageWrapper'
