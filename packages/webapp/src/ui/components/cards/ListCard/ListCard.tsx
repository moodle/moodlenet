import { Trans } from '@lingui/macro';
import { FC, ReactNode } from "react";
import "./styles.scss";

export type ListCardProps = {
    className: string,
    title: string,
    content: ReactNode[]
    noCard?: boolean,
    maxColumns?: number
}

export const ListCard: FC <ListCardProps> = ({
    className,
    content,
    title,
    noCard
}) => {

  return (
    <div className={`list-card ${className} ${noCard ? "no-card" : ""}`}>
        <div className="title"><Trans>{title}</Trans></div>
        <div className="content">{content}</div>
    </div>
  );
}

ListCard.defaultProps = {
  noCard: false,
  maxColumns: 1
}

export default ListCard;
