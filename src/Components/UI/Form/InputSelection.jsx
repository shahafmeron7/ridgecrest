import React, { useState } from "react";
import styles from "./InputSelection.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
const InputSelection = ({ subQuestion,selectedAnswerIndex }) => {
  const [selectedIndex, setSelectedIndex] = useState(selectedAnswerIndex);
 
  const { handleSelectionInputChange } = useQuestionnaire();

  const handleSelect = (questionCode, index) => {

    setSelectedIndex(index);

    handleSelectionInputChange(questionCode, index);
  };

  return (
    <ul className={styles.selectionListContainer}>
      {subQuestion.answers.map((answer, index) => (
        <li
          key={answer+index}
          className={`${styles.selectionListItem} ${
            selectedIndex === index ? styles.selected : ""
          }`}
          onClick={() => handleSelect(subQuestion.code, index)}
        >
          {answer}
        </li>
      ))}
    </ul>
  );
};

export default InputSelection;
