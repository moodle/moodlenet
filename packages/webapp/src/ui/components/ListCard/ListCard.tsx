import { FC, ReactNode } from "react";
import "./styles.scss";

export type ListCardProps = {
    className: string,
    preTitle: string,
    title: string,
    content: ReactNode[]
}

export const ListCard: FC <ListCardProps> = ({
    className,
    content,
    preTitle,
    title
}) => {
  return (
    <div className={"list-card " + className}>
        <div className="title">{preTitle + title}</div>
        <div className="content">{content}</div>
    </div>
  );
}

export default ListCard;
