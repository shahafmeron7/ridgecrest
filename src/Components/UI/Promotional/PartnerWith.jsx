import React from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import styles from './PartnerWith.module.css';
import useIsWideScreen from "@/hooks/useIsWideScreen";
import { partnerBrands}  from "@/utils/data/partnerWithBrands";
const PartnerWith = () => {


  const { questionnaireCompleted } = useQuestionnaire();
  const isWideScreen = useIsWideScreen();

  const finalStyle = {
    padding: "80px 0px 0px 0px",
  };
  const finalMobileStyle = {
    padding: "24px 16px 0px",
  };

  return (
    <div className={styles.partnerWithWrapper} style={questionnaireCompleted && !isWideScreen ? finalMobileStyle : questionnaireCompleted && isWideScreen ? finalStyle : {}}>
      <div className={styles.partnerWithContainer}>
        <h2 className={styles.partnerWithTitle}>We proudly partner with</h2>
        <div className={styles.partnerWithDivider}></div>
        <div className={styles.partnerWithBrandsContainer}>
          {partnerBrands.map((logo, index) => (
            <div key={logo.alt} className={styles.partnerWithLogoContainer} >
              <img height="30" width="100" className={styles.partnerWithLogo} src={logo.src} alt={logo.alt} loading="lazy" />

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerWith;
