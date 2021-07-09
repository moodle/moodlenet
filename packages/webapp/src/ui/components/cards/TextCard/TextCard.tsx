import { FC } from "react";
import "./styles.scss";

export type TextCardProps = {}

export const TextCard: FC<TextCardProps> = ({children}) => {
  

  return (
    <div className="text-card">
        <div className="text">{children}</div>
    </div>
  );
}

export default TextCard;