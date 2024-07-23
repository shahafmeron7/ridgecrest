import React, { useState,useEffect } from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import styles from "./CheckboxInput.module.css";
import selectedSvg from "@/images/selectedcheckbox.svg?url";
import unselectedSvg from "@/images/unselectedcheckbox.svg?url";
import InputError from "./InputError";
const CheckboxInput = ({ subQuestion, isChecked, errorMessage, isError,marginTop=null }) => {
  const initialChecked = isChecked !== undefined ? isChecked : 0;

  const [isSelected, setIsSelected] = useState(initialChecked === 1);
  const { handleSelectionInputChange,currentQuestion } = useQuestionnaire();
  const [error, setError] = useState(isError);

  useEffect(() => {
    setError(isError);
  }, [isError]);
  const handleSelect = () => {
    setIsSelected((prevState) => !prevState);
    handleSelectionInputChange(
      subQuestion.code,
      isSelected ? 0 : 1,
      subQuestion.element
    );
  };

  return (
    <div className={styles.checkboxContainer}>
    <div className={styles.checkboxWrapper}>

      <img
        src={isSelected ? selectedSvg : unselectedSvg}
        alt={isSelected ? "Selected" : "Unselected"}
        className={styles.checkbox}
        onClick={handleSelect}
      />
      {currentQuestion.type ==="document" ? (
        <p>
          {subQuestion.text}
        </p>
      ):(
        <p>
        By checking this box, you electronically consent to the Ridge Crest
        Financial Group, LLC{" "}
        <a href="https://ridgecrestfg.com/terms-of-use/" className={styles.link}>Terms and Conditions</a> and{" "}
        <a href="https://ridgecrestfg.com/privacy-policy/" className={styles.link}>Privacy policy</a>
      </p>
      )}
     
    </div>
    
      <InputError error={error} message={errorMessage} marginTop={marginTop}/>
    </div>
  );
};

export default CheckboxInput;
