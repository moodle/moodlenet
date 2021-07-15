import ArrowAltIcon from '@material-ui/icons/ArrowRightAltRounded';
import SwapVertIcon from '@material-ui/icons/SwapVertRounded';
import { FC, useState } from "react";
import "./styles.scss";

export type CheckButtonProps = {
  label: string
  state?: 'inactive' | 'more' | 'less'
}

export const CheckButton: FC<CheckButtonProps> = ({label, state}) => {
  const [inState, setInState] = useState(state);
  
  const onClick = () => {
    if (inState === 'inactive') { setInState('more')}
    else if (inState === 'more') { setInState('less') }
    else { setInState('inactive') }
  }

  return (
    <div className={`check-button ${inState}`} onClick={onClick}>
        <div className="icon inactive-icon"><SwapVertIcon /></div>
        <div className="icon more-icon"><ArrowAltIcon /></div>
        <div className="icon less-icon"><ArrowAltIcon /></div>
        <span className="label">{label}</span>
    </div>
  );
}

CheckButton.defaultProps = {
  state: 'inactive'
}

export default CheckButton;