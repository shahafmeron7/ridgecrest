import React from "react";
import { useQuestionnaire } from "../../../context/QuestionnaireContext.jsx";
import styles from "./FormProgress.module.css";

const FormProgress = () => {
  const { currentQuestion, formQuestions } = useQuestionnaire();

  const currentStepNumber = formQuestions.find(
    (q) => q.step == currentQuestion.step
  )?.step;

  return (
    <div
      key={currentQuestion.code}
      className={`${styles.formProgressContainer}`}
    >
      <div className={styles.formProgressWrapper}>
        {formQuestions.map((question) => (
            <div
              key={question.code}
              className={`${styles.formProgressItem}`}
            >
              <p
                className={`${styles.progressText} ${
                currentStepNumber > question.step ? styles.completedStep : currentStepNumber === question.step ? styles.currentStep : ""
                }`}
              >
                {question.step} - {question.text}
              </p>
              <div className={styles.customBorder}></div>

            </div>
         
        ))}
      </div>
    </div>
  );
};

export default FormProgress;
