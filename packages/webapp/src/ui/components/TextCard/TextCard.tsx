import { FC } from "react";
import '../../styles/tags.css';
import "./styles.scss";

export type TextCardProps = {}

export const TextCard: FC<TextCardProps> = (props) => {
  

  return (
    <div className="text-card">
        <div className="text">{props.children}</div>
    </div>
  );
}

export default TextCard;