import React from "react";
import styles from "./AnswersContent.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import InputWithValidation from "@/components/UI/Form/InputWithValidation";
import useIsWideScreen from "@/hooks/useIsWideScreen";
import InputSelection from "@/components/UI/Form/InputSelection";
import Dropdown from "@/components/UI/Form/Dropdown";
import DateOfBirthInput from "@/components/UI/Form/inputs/DateOfBirthInput";
import PercentageInput from "@/components/UI/Form/inputs/PercentageInput";

const DetailsQuestion = () => {
  const { currentQuestion, responses, errResponses,formProgressStep, currentQuestionCode } = useQuestionnaire();
  const isWideScreen = useIsWideScreen();
  const isFinalStep = currentQuestionCode === "phone";
  const isPersonalAndBusinessInfo = currentQuestionCode === "personal_and_business_info";

  const FinalStepTitle = ({ text }) => (
    <div className={styles.finalStepTitleWrapper}>
      <h1 className={styles.finalStepTitle}>Final Step</h1>
      <h4 className={styles.inputTitle}>{text}</h4>
    </div>
  );

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
      default:
        return null;
    }
  };
  const subquestions = currentQuestion.formSteps[formProgressStep-1].subquestions;
  return (
    <div
      key={currentQuestionCode}
      className={`animateFadeOut ${styles.inputsContainer} ${
        isPersonalAndBusinessInfo && isWideScreen ? styles.specialLayout : ""
      }`}
    >
     

      {subquestions.map((sub, index) => (
        <div
          key={`${sub.code}-${index}`}
          className={`animateStaggerItem ${styles.inputWrapper} ${
            isPersonalAndBusinessInfo && isWideScreen && index < 2 ? styles.rowChild : ""
          }`}
          style={sub.code === 'company_name' ? { width: "100%" } : {}}
        >
          {isFinalStep ? <FinalStepTitle text={sub.text} /> : <h4 className={styles.inputTitle}>{sub.text}</h4>}
          {renderInputField(sub)}
        </div>
      ))}
    </div>
  );
};

export default DetailsQuestion;
// {currentQuestion.subquestions.map((sub, index) => (