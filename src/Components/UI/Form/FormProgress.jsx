import React from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import styles from "./FormProgress.module.css";
import useIsWideScreen from "@/hooks/useIsWideScreen";

const FormProgress = () => {
  const { currentQuestion, formQuestions,formProgressStep } = useQuestionnaire();
  const isWideScreen = useIsWideScreen()
  const currentStepNumber = formQuestions.find(
    (q) => q.step === currentQuestion.step
  )?.step;

  const renderProgressLines = (question) => {
    const subSteps = question.formSteps?.length || 1; // Default to 1 if no subSteps are defined
    const lines = [];

    for (let i = 0; i < subSteps; i++) {
      const stepClass = currentStepNumber > question.step || (currentStepNumber === question.step && formProgressStep > i + 1)
        ? styles.completedStep
        : currentStepNumber === question.step && formProgressStep === i + 1
        ? styles.currentStep
        : "";

      lines.push(
        <div key={i} className={`${styles.progressLine} ${stepClass}`}></div>
      );
    }

    return lines;
  };
  const adjustTextForMobile = (text) => {
    //  if (!isWideScreen) {
    //    return text.replace(/information/gi, 'info');
    //  }
    return text;
  };

  return (
    <div
      key={currentQuestion.code}
      className={`${styles.formProgressContainer}`}
    >
      <div className={styles.formProgressWrapper}>
        {formQuestions.map((question) => (
          <div key={question.code} className={`${styles.formProgressItem}`}>
            <p>
            {question.step} -{!isWideScreen && <br />} {adjustTextForMobile(question.text)}
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
