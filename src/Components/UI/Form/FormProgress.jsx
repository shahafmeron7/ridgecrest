import React from "react";
import { useQuestionnaire } from "../../../context/QuestionnaireContext.jsx";
import styles from "./FormProgress.module.css";

const FormProgress = () => {
  const { currentQuestion, formQuestions } = useQuestionnaire();

  const currentStepNumber = formQuestions.find(
    (q) => q.step == currentQuestion.step
  )?.step;

  const renderProgressLines = (question) => {
    const subSteps = question.subSteps || 1; // Default to 1 if no subSteps are defined
    const lines = [];
    for (let i = 0; i < subSteps; i++) {
      lines.push(
        <div
          key={i}
          className={`${styles.progressLine} ${
            currentStepNumber > question.step
              ? styles.completedStep
              : currentStepNumber === question.step
              ? styles.currentStep
              : ""
          }`}
        ></div>
      );
    }
    return lines;
  };

  return (
    <div
      key={currentQuestion.code}
      className={`${styles.formProgressContainer}`}
    >
      <div className={styles.formProgressWrapper}>
        {formQuestions.map((question) => (
          <div key={question.code} className={`${styles.formProgressItem}`}>
            <p
              // className={`${
              //   currentStepNumber > question.step
              //     ? styles.completedStep
              //     : currentStepNumber === question.step
              //     ? styles.currentStep
              //     : ""
              // }`}
            >
              {question.step} - {question.text}
            </p>
            <div className={styles.progressLineContainer}>
              {renderProgressLines(question)}
            </div>
            <div className={styles.customBorder}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormProgress;
