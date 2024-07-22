import React, { useState,useEffect } from "react";
import styles from "./InputSelection.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import useIsWideScreen from "@/hooks/useIsWideScreen";
import InputError from "./InputError";

const InputSelection = ({ subQuestion,selectedAnswerIndex,isError,errorMessage }) => {
  const isWideScreen = useIsWideScreen();

  const [selectedIndex, setSelectedIndex] = useState(selectedAnswerIndex);
  const [error, setError] = useState(isError);
 
  const { handleSelectionInputChange } = useQuestionnaire();

  useEffect(() => {
    setError(isError);
  }, [isError]);
  
  const handleSelect = (questionCode, index) => {

    setSelectedIndex(index);

    handleSelectionInputChange(questionCode, index);
  };
  const isMobile = !isWideScreen;
  const isTwoItems = subQuestion.answers.length === 2;
  const isMoreThanTwoItems = subQuestion.answers.length > 2;

  const flexDirection = isMobile
    ? isTwoItems
      ? "row"
      : "column"
    : "row";
    const getBorderRadius = (index, length) => {
      if (isMobile) {
        if (isTwoItems) {
          if (index === 0) return "12px 0px 0px 12px";
          if (index === 1) return "0px 12px 12px 0px";
        }
        if (isMoreThanTwoItems) {
          if (index === 0) return "12px 12px 0px 0px";
          if (index === length - 1) return "0px 0px 12px 12px";
          return "0px";
        }
      } else {
        if (index === 0) return "12px 0px 0px 12px";
        if (index === length - 1) return "0px 12px 12px 0px";
      }
      return "0px";
    };
    const getBorderStyle = (index, length) => {
      if (isMobile) {
        if (isTwoItems) {
          return {
            borderLeft: "1px solid var(--grey-border-color)",
            borderTop: "1px solid var(--grey-border-color)",
            borderRight: index===1 ? "1px solid var(--grey-border-color)" : "none",
            borderBottom: "1px solid var(--grey-border-color)"
          };
        }
        if (isMoreThanTwoItems) {
          return {
            borderLeft: "1px solid var(--grey-border-color)",
            borderRight: "1px solid var(--grey-border-color)",
            borderBottom: index === length - 1 ? "1px solid var(--grey-border-color)" : "1px solid var(--grey-border-color)",
            borderTop: index === 0 ? "1px solid var(--grey-border-color)" : "none",
            flex:"unset"
          };
        }
      } else {
        return {
          borderLeft: index >= 0 ? "1px solid var(--grey-border-color)" : "none",
          borderRight: index==length-1? "1px solid var(--grey-border-color)" :"none",
          borderBottom: "1px solid var(--grey-border-color)",
          borderTop: "1px solid var(--grey-border-color)"
          
        };
      }
      return {};
    };
  return (
    <>

    <ul className={styles.selectionListContainer}
          style={{ flexDirection: flexDirection }}

    >
      {subQuestion.answers.map((answer, index) => (
        <li
          key={answer+index}
          className={`${styles.selectionListItem} ${
            selectedIndex === index ? styles.selected : ""
          }`}
          onClick={() => handleSelect(subQuestion.code, index)}
          style={{
            borderRadius: getBorderRadius(index, subQuestion.answers.length),
            ...getBorderStyle(index, subQuestion.answers.length),
          }}
        >
          {answer}
        </li>
      ))}
    </ul>
    <InputError error={error} message={errorMessage} />
    </>
  );
};

export default InputSelection;
