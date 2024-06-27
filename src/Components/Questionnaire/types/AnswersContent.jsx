import React from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import OneSelectionQuestion from "./OneSelectionQuestion.jsx";
import DetailsQuestion from "./DetailsQuestion.jsx";

const AnswersContent = () => {
  const { currentQuestion } = useQuestionnaire();
  const questionComponents = {
    "one-selection": OneSelectionQuestion,
    "details-question": DetailsQuestion,
    "form-type": DetailsQuestion,
  };

  const QuestionComponent = questionComponents[currentQuestion.type];

  if (!QuestionComponent) {
    return <>Question type not supported</>;
  }

  return <QuestionComponent/>;
};

export default AnswersContent;
