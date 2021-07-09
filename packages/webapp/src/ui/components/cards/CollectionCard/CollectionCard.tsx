import { FC } from 'react';
import '../../../styles/tags.css';
import "./styles.scss";

export type CollectionCardProps = {
  imageUrl: string
  title:string
}

export const CollectionCard:FC<CollectionCardProps>=({ imageUrl, title }) =>{
  const background = {
    backgroundImage: "url(" + imageUrl + ")",
    backgroundSize: "cover"
  }
  
  return (
    <div className="collection-card" style={background}>
      <div className="title">{title}</div>
    </div>
  );
}

