import { FC, ReactNode } from "react";
import "./styles.scss";

export type ListCardProps = {
    className: string,
    title: string,
    content: ReactNode[]
}

export const ListCard: FC <ListCardProps> = ({
    className,
    content,
    title
}) => {
  return (
    <div className={"list-card " + className}>
        <div className="title">{title}</div>
        <div className="content">{content}</div>
    </div>
  );
}

export default ListCard;
