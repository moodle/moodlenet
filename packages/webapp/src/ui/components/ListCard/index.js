import React from "react";
import "./styles.scss";

function ListCard(props) {
  return (
    <div className={"list-card " + props.className}>
        <div className="title">{props.title}</div>
        <div className="content">{props.content}</div>
    </div>
  );
}

export default ListCard;
