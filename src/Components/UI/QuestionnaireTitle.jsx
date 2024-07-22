import React from 'react'
import styles from '@/components/Questionnaire/Questionnaire.module.css'
import { useQuestionnaire } from "@/context/QuestionnaireContext";
const QuestionnaireTitle = () => {
    const {currentQuestionCode,currentQuestion} = useQuestionnaire();
    return (
      <div key={currentQuestionCode} className={`${styles.titleWrapper}`}>
      <h1 className={styles.title}>{currentQuestion.step==1 ? "Get Funded in a Few Easy Steps"  : currentQuestionCode==="financial_information" ? 'Final Step' : currentQuestion.text}</h1>
      {/* <h2 className={styles.titleDescription}>Just a few questions to find your match</h2> */}
    </div>
    );
  };

export default QuestionnaireTitle