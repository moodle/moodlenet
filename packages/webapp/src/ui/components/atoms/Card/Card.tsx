import { CSSProperties, FC } from "react";
import "./styles.scss";

export type CardProps = {
  className?: string
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
}

export const Card: FC<CardProps> = ({className, style, hideBorderWhenSmall, children}) => {
  

  return (
    <div className={`card ${className} ${hideBorderWhenSmall ? 'hide-border': ''}`} style={style}>{children}</div>
  );
}

Card.defaultProps = {
}

export default Card;