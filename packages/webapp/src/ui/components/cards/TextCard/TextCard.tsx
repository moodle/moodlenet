import { FC } from "react";
import Card from "../../atoms/Card/Card";
import "./styles.scss";

export type TextCardProps = {}

export const TextCard: FC<TextCardProps> = ({children}) => {
  

  return (
    <div className="text-card">
      <Card>
        <div className="text">{children}</div>
      </Card>
    </div>
  );
}

export default TextCard;