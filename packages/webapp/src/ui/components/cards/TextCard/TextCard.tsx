import { FC } from "react";
import Card from "../../atoms/Card/Card";
import "./styles.scss";

export type TextCardProps = {}

export const TextCard: FC<TextCardProps> = ({children}) => {
  

  return (
    <Card>
      <div className="text">{children}</div>
    </Card>
  );
}

export default TextCard;