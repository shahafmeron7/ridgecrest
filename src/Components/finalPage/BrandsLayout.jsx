import React from "react";
import styles from "./BrandsLayout.module.css";

// import { brandsCards } from "@/utils/data/brandsData";
import {brandsCards} from "@/utils/data/brandsData"
const BrandCard = ({ card }) => {
  const outlink = `https://out.sonary.com/track/click/?pid=${card.pid}&internal=true&page=${window.location.pathname}&action=payroll_leadgen`
  return (
    <div className={styles.cardContainer}>
      <img src={card.src} alt={card.alt} className={styles.bestMatchLogo} />
        <a href={outlink} target="_blank" rel="noopener noreferrer" className={styles.cardButton}>Visit Site</a>
        
      <div className={styles.divider}></div>
      <div className={styles.pros_cons}>
        {Object.entries(card.pros_cons).map(
          ([listName, listDetails]) => (
            <div key={listName} className={styles.pros_cons_list_container}>
              <p className={styles.pros_cons_title}>{listName}</p>
              <div className={styles.pros_cons_list}>
                {listDetails.list.map((listItem, index) => (
                  <div key={index} className={styles.listItem}>
                    <img
                      src={listDetails.icon}
                      alt={`${listName} icon`}
                      className={styles.prosConsIcon}
                      loading="lazy"
                    />

                    <p>{listItem}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

 const BrandsLayout = () => {
  return (
    <div className={styles.brandsLayoutContainer}>
      <h2 className={styles.titleSection}>
        Are you also interested in HR Software?
      </h2>
      <div className={styles.brandsContainer}>
        {brandsCards.map((card, index) => (
          <BrandCard key={index} card={card} />
        ))}
      </div>
      
        <a className={styles.compareButton} href="https://top-payrollservices.com/hr/">Compare more top providers</a>
  
    </div>
  );
};

export default BrandsLayout;
