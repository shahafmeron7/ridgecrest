import React from "react";
import styles from "./AnswersContent.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import InputWithValidation from "@/components/UI/Form/inputs/InputWithValidation";
import useIsWideScreen from "@/hooks/useIsWideScreen";
import InputSelection from "@/components/UI/Form/inputs/InputSelection";
import Dropdown from "@/components/UI/Form/inputs/Dropdown";
import DateOfBirthInput from "@/components/UI/Form/inputs/DateOfBirthInput";
import PercentageInput from "@/components/UI/Form/inputs/PercentageInput";
import CheckboxInput from "@/components/UI/Form/inputs/CheckboxInput";

const DetailsQuestion = () => {
  const { currentQuestion, responses, errResponses,formProgressStep, currentQuestionCode } = useQuestionnaire();
  const isWideScreen = useIsWideScreen();

  
  const renderInputField = (sub) => {
    const commonProps = {
      name: sub.code,
      value: responses[sub.code]?.answer || "",
      validationCode: sub.validationCode,
      placeholder: sub.example,
      minLength: sub.minLength,
      maxLength: sub.maxLength,
      errorMessage: sub.error,
      isError: errResponses[sub.code] || false,
    };

    switch (sub.element) {
      case 'input':
      case 'free_text':
        return <InputWithValidation type={sub.type} inputType={sub.element} {...commonProps} />;
      case 'dropdown':
        return <Dropdown subQuestion={sub} selectedAnswerIndex={responses[sub.code]?.answerIndexes[0]} />;
      case 'birthdate':
        return <DateOfBirthInput selectedAnswerIndexes={responses[sub.code]?.answerIndexes || ""} />;
      case 'selection':
        return <InputSelection subQuestion={sub} selectedAnswerIndex={responses[sub.code]?.answerIndexes[0]} />;
      case 'percentage':
        return <PercentageInput subQuestion={sub} isError={errResponses[sub.code] || false} />;
      case 'checkbox':
        return <CheckboxInput subQuestion={sub} isChecked={responses[sub.code]?.answerIndexes[0]}/>
      default:
        return null;
    }
  };
  const subquestions = currentQuestion.formSteps[formProgressStep-1].subquestions;
  return (
    <div
      key={`${currentQuestionCode}-${formProgressStep}`}
      className={`animateFadeIn animateFadeOut ${styles.inputsContainer}`}>
    
      {subquestions.map((sub, index) => (
        <div
          key={`${sub.code}-${index}`}
          className={`animateStaggerItem ${styles.inputWrapper}`}

        >
        {sub.element!=="checkbox" && <h4 className={styles.inputTitle}>{sub.text}</h4>}
          {renderInputField(sub)}
        </div>
      ))}
    {/* <CheckboxInput/> */}
    </div>
  );
};

export default DetailsQuestion;
// {currentQuestion.subquestions.map((sub, index) => (