import React from "react";
import styles from "./ThankYou.module.css";
import TrohpyIcon from "@/images/thank you/Trophy.svg?url";

const ThankYou = () => {
  return (
    <div className={styles.thankYouContainer}>
      <img src={TrohpyIcon} aria-label={"Trophy Icon"} alt="Trohpy Icon"/>
      <div className={styles.titleWrapper}>
        <h1 className={styles.thankYouTitle}>Thank You</h1>
        <p className={styles.thankYouDesc}>
        for choosing Ridge Crest Financial Group! <br/>Your application is being reviewed and one of our agents will contact you shortly.
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
