import { FC } from "react";
import "./styles.scss";

export type CardProps = {}

export const Card: FC<CardProps> = ({children}) => {
  

  return (
    <div className="card">{children}
    </div>
  );
}

export default Card;