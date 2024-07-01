import React from "react";
import styles from "./AnswersContent.module.css";

import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";

import InputWithValidation from "@/components/UI/Form/InputWithValidation";

import useIsWideScreen from "@/hooks/useIsWideScreen";
import InputSelection from "@/components/UI/Form/InputSelection";
import Dropdown from "@/components/UI/Form/Dropdown";
import DateOfBirthInput from "../../UI/Form/inputs/DateOfBirthInput";
const DetailsQuestion = () => {
  const { currentQuestion, responses, errResponses, currentQuestionCode } =
    useQuestionnaire();
  const isWideScreen = useIsWideScreen();
    const isFinalStep = currentQuestionCode === "phone";

  const isPersonalAndBusinessInfo =
    currentQuestionCode === "personal_and_business_info";
  const FinalStepTitle = ({ text }) => {
    return (
      <div className={styles.finalStepTitleWrapper}>
        <h1 className={styles.finalStepTitle}>Final Step</h1>
        <h4 className={styles.inputTitle}>{text}</h4>
      </div>
    );
  };
 
  return (
    <div
    key={currentQuestionCode}
      className={`animateFadeOut ${styles.inputsContainer} ${
        isPersonalAndBusinessInfo && isWideScreen ? styles.specialLayout : ""
      }`}
    >
   
      {currentQuestion.subquestions.map((sub, index) => (
         
          <div
            key={`${sub.code}-${index}`}
            className={`animateStaggerItem ${styles.inputWrapper} ${
              isPersonalAndBusinessInfo && isWideScreen && index < 2
                ? styles.rowChild
                : ""
            }`} style={sub.code==='company_name' ? {width:"100%"}:{}}
          >
            {isFinalStep ? (
              <FinalStepTitle text={sub.text} />
            ) : (
               <h4 className={styles.inputTitle}>{sub.text}</h4>
            )}
            {sub.element ==='input' || sub.element ==='free_text'  ? (
              <InputWithValidation
              type="text"
              inputType={sub.element}
              name={sub.code}
              value={responses[sub.code]?.answer || ""}
              placeholder={sub.example}
              maxLength={sub.maxLength}
              errorMessage={sub.error}
              isError={errResponses[sub.code] || false}
            />
            ): 
            sub.element === "dropdown" ? (
            <Dropdown subQuestion={sub}
            selectedAnswerIndex={responses[sub.code]?.answerIndexes[0]}
             />
          ) :
          sub.element ==="birthdate" ? (
            <DateOfBirthInput
                            selectedAnswerIndexes={responses[sub.code]?.answerIndexes || ""}
            />
          )
           : 
            (
              <InputSelection subQuestion={sub}
            selectedAnswerIndex={responses[sub.code]?.answerIndexes[0]}

              />
            )}
            
            </div>
      ))}
    
    </div>
  );
};

export default DetailsQuestion;
