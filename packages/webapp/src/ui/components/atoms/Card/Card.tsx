import { CSSProperties, FC } from "react";
import "./styles.scss";

export type CardProps = {
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
}

export const Card: FC<CardProps> = ({style, hideBorderWhenSmall, children}) => {
  

  return (
    <div className={`card ${hideBorderWhenSmall ? 'hide-border': ''}`} style={style}>{children}</div>
  );
}

Card.defaultProps = {
}

export default Card;