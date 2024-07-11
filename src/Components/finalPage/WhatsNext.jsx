import React from 'react'
import styles from './WhatsNext.module.css'
import { cards } from '@/utils/data/whatNextCards'
const WhatsNext = () => {
    
      const Card = ({ card }) => {
        const renderInfoTextWithBolds = (info, bolds) => {
          let modifiedText = info;
      
          // Replace bold words with markers that will not be affected by the split operation
          bolds.forEach((boldWord, index) => {
            const marker = `@@${index}@@`;
            modifiedText = modifiedText.replace(boldWord, marker);
          });
      
          // Split text by spaces, but keep markers intact
          const parts = modifiedText.split(/(\s+|@@\d+@@)/).filter(part => part);
      
          // Replace markers with bold words and return array of strings and JSX elements
          return parts.map((part, index) => {
            const match = part.match(/^@@(\d+)@@$/);
            if (match) {
              const boldIndex = parseInt(match[1], 10);
              return <strong key={index}>{bolds[boldIndex]}</strong>;
            }
            return part;
          });
        };
        const renderEmail = (info,email)=>{

        }
      
        return (
          <div className={styles.card}>
          <div className={styles.imgContainer}>
            <img src={card.src} alt={card.alt} className={styles.cardIcon} loading="lazy" width="80" height="80" />
          </div>
            <div className={styles.cardInfoWrapper}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              {card.email? (
                <p className={styles.cardInfo}>
                We're here for you if you need anything throughout the lending process. Feel free to call us or send an email with any questions or concerns to <a className={styles.link} href={`mailto:${card.email[0]}`}>hello@ridgecrestfg.com</a> and we'll get back to you as soon as possible.

                </p>
              ):(

              <p className={styles.cardInfo}>
                { card.bolds.length>1 ? renderInfoTextWithBolds(card.info, card.bolds) : card.info}
              </p>
              )}
            </div>
          </div>
        );
      };
  return (
    <div className={styles.container}>
        <h2 className={styles.titleSection}>What's next?</h2>

        <div className={styles.cardsContainer}>
            {cards.map((card,index)=>(
                <Card key={index} card={card}/>
            ))}
        </div>
        
    </div>
  )
}

export default WhatsNext