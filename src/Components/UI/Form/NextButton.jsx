import React,{useEffect} from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import styles from "@/components/UI/Form/NextButton.module.css";

const NextButton = () => {
   const {
      checkAndEnableNextButton,
      moveToNextQuestion,
      inputModified,
      nextBtnEnabled,
      currentQuestionCode,
      responses,
      isAnimatingOut,
      currentQuestion,
      formProgressStep,
      questionnaireStarted
    } = useQuestionnaire();
    const handleNextButtonClick = () => {
      if (!isAnimatingOut) {
        moveToNextQuestion();
      }
    };
  
    useEffect(() => {
      checkAndEnableNextButton();
    }, [checkAndEnableNextButton, currentQuestion, responses]);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Enter" && (inputModified || nextBtnEnabled)) {
          handleNextButtonClick();
          event.preventDefault();
        }
      };
  
      document.addEventListener("keydown", handleKeyDown);
  
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleNextButtonClick, inputModified, nextBtnEnabled]);

    const appVersion = import.meta.env.VITE_APP_VERSION;
    const finalQuestionCode = appVersion === 'long' ?   'documents' : 'business_information';
    //to indicate if its the last substep as well.
    const isFinalStep = formProgressStep == currentQuestion.formSteps?.length;
    
    
  
    const buttonText = !questionnaireStarted
      ? "Let's start"
      : currentQuestionCode === finalQuestionCode && isFinalStep
      ? 'Submit'
      : 'Next';

   const formStyle =
     currentQuestionCode === "document"
      ? styles.formResultBtn
      : "";
  return (
    <>
       <button
        className={`${styles.nextBtn} ${
          inputModified || nextBtnEnabled ? styles.enabled : ""
        } ${formStyle}`}
        onClick={() => handleNextButtonClick()}
        disabled={isAnimatingOut || !nextBtnEnabled}
      >
        {buttonText}
        {/* {!questionnaireStarted ? "Let's start" : isFinalStep ? "Submit" : "Next"} */}
      </button>
    </>
  );
};

export default NextButton;
