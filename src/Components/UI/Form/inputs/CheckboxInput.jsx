import React, { useState,useEffect } from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import styles from "./CheckboxInput.module.css";
import selectedSvg from "@/images/selectedcheckbox.svg?url";
import unselectedSvg from "@/images/unselectedcheckbox.svg?url";
import InputError from "./InputError";
const CheckboxInput = ({ subQuestion, isChecked, errorMessage, isError }) => {
  const [isSelected, setIsSelected] = useState(isChecked);
  const { handleSelectionInputChange } = useQuestionnaire();
  const [error, setError] = useState(isError);

  useEffect(() => {
    setError(isError);
  }, [isError]);
  const handleSelect = () => {
    setIsSelected((prevState) => !prevState);
    handleSelectionInputChange(
      subQuestion.code,
      !isSelected ? 1 : 0,
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
      <p>
        By checking this box, you electronically consent to the Ridge Crest
        Financial Group, LLC{" "}
        <a className={styles.link}>Terms and Conditions</a> and{" "}
        <a href="https://ridgecrestfg.com/privacy-policy/" className={styles.link}>Privacy policy</a>
      </p>
    </div>
    
      <InputError error={error} message={errorMessage} />
    </div>
  );
};

export default CheckboxInput;
