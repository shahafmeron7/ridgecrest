import React, { useState } from "react";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import styles from "./CheckboxInput.module.css";
import selectedSvg from "@/images/selectedcheckbox.svg?url";
import unselectedSvg from "@/images/unselectedcheckbox.svg?url";

const CheckboxInput = ({ subQuestion, isChecked }) => {
  const [isSelected, setIsSelected] = useState(isChecked);
  const { handleSelectionInputChange } = useQuestionnaire();

  const handleSelect = () => {
    setIsSelected((prevState) => !prevState);
    handleSelectionInputChange(subQuestion.code, !isSelected ? 1 : 0, subQuestion.element);
  };

  return (
    <div className={styles.checkboxContainer} onClick={handleSelect}>
      <img
        src={isSelected ? selectedSvg : unselectedSvg}
        alt={isSelected ? "Selected" : "Unselected"}
        className={styles.checkbox}
      />
      <p>
        By checking this box, you electronically consent to the Ridge Crest
        Financial Group, LLC{" "}
        <span className={styles.link}>Terms and Conditions</span> and{" "}
        <span className={styles.link}>Privacy policy</span>
      </p>
    </div>
  );
};

export default CheckboxInput;
