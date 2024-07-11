import React from 'react';
import  ClockIcon  from "@/images/form icons/clock2.svg";
import  LockIcon  from "@/images/form icons/lock.svg";
import  TrustedIcon  from "@/images/form icons/trustedcheckmark.svg";
import obligationIcon from "@/images/form icons/obligation.svg"
import styles from './FormIcons.module.css';
// import { useQuestionnaire } from '../../context/QuestionnaireContext';
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
const FormIcons = () => {
    const {currentQuestionCode} = useQuestionnaire()
    const icons = [
        {
            text: "Secure Form",
            Icon: LockIcon,
            alt: "lock icon"
        },
        {
            text: "Takes Just Minutes",
            Icon: ClockIcon, 
            alt: "trust checkmark icon"
        },
        {
            text: "No Obligation",
            Icon: obligationIcon,
            alt: "clock icon"
        }
    ];

    return (
        <div key={currentQuestionCode} className={`animateFadeOut ${styles.formIconsContainer}`}>
            {icons.map((icon, index) => (
                <div key={index} className={styles.IconContainer}>
                    <icon.Icon aria-label={icon.alt} /> 
                    <p>{icon.text}</p>
                </div>
            ))}
        </div>
    );
};

export default FormIcons;

