import { CSSProperties, FC } from "react";
import "./styles.scss";

export type CardProps = {
  style?: CSSProperties
}

export const Card: FC<CardProps> = ({style, children}) => {
  

  return (
    <div className="card" style={style}>{children}</div>
  );
}

Card.defaultProps = {}

export default Card;