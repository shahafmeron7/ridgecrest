import React,{useEffect} from "react";
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
  const {
    currentQuestion,
    responses,
    errResponses,
    formProgressStep,
    currentQuestionCode,
    responsesUpdated
  } = useQuestionnaire();
  const isWideScreen = useIsWideScreen();
  // useEffect(() => {
  //   // Force a re-render by using responsesUpdated
  //   console.log('responsesUpdated in details');
  // }, [responsesUpdated]);
  const renderInputField = (sub) => {
    const commonProps = {
      name: sub.code,
      value: responses?.[sub.code]?.answer || "",
      validationCode: sub.validationCode,
      placeholder: sub.example,
      minLength: sub.minLength,
      maxLength: sub.maxLength,
      errorMessage: sub.error,
      isError: errResponses[sub.code] || false,
    };
    //  console.log('renderding?')
    switch (sub.element) {
      case "input":
      case "free_text":
        return (
          <InputWithValidation
            type={sub.type}
            inputType={sub.element}
            {...commonProps}
          />
        );
      case "dropdown":
        return (
          <Dropdown
          options={sub.answers}
             subQuestion={sub}
             selectedAnswerIndex={responses?.[sub.code]?.answerIndexes[0]}
             isError={errResponses[sub.code] || false}
             errorMessage={sub.error}
          />
        );
      case "birthdate":
        return (
          <DateOfBirthInput
            selectedAnswerIndexes={responses?.[sub.code]?.answerIndexes || ""}
            isError={errResponses[sub.code] || false}
            errorMessage={sub.error}
          />
        );
      case "selection":
        return (
          <InputSelection
            subQuestion={sub}
            selectedAnswerIndex={responses?.[sub.code]?.answerIndexes[0]}
            isError={errResponses[sub.code] || false}
            errorMessage={sub.error}
          />
        );
      case "percentage":
        return (
          <PercentageInput
            subQuestion={sub}
            value={ responses?.[sub.code]?.answer || ""}
            isError={errResponses[sub.code] || false}
            
            errorMessage={sub.error}
          />
        );
      case "checkbox":
        return (
          <CheckboxInput
            subQuestion={sub}
            isChecked={responses?.[sub.code]?.answerIndexes[0]}
            isError={errResponses[sub.code] || false}
            errorMessage={sub.error}
          />
        );
      default:
        return null;
    }
  };
  const subquestions =
    currentQuestion.formSteps[formProgressStep - 1].subquestions;
  return (
    <div
      key={`${currentQuestionCode}-${formProgressStep}`}
      className={`animateFadeIn animateFadeOut ${styles.inputsContainer}`}
    >
      {subquestions.map((sub, index) => (
        <div
          key={`${sub.code}-${index}`}
          className={`animateStaggerItem ${styles.inputWrapper}`}
        >
          {sub.element !== "checkbox" && (
            <h4 className={styles.inputTitle}>{sub.text}</h4>
          )}
          {renderInputField(sub)}
        </div>
      ))}
     
    </div>
  );
};

export default DetailsQuestion;
