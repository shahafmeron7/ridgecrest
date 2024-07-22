import React, { useState,useEffect } from "react";
import styles from "./CheckboxInput.module.css";
import selectedSvg from "@/images/selectedcheckbox.svg?url";
import unselectedSvg from "@/images/unselectedcheckbox.svg?url";
import InputError from "./InputError";
const DocumentCheckboxInput = () => {
  const [isSelected, setIsSelected] = useState(false);
//   const { handleSelectionInputChange } = useQuestionnaire();
  const [error, setError] = useState();

//   useEffect(() => {
//     setError(isError);
//   }, [isError]);
  const handleSelect = () => {
    setIsSelected((prevState) => !prevState);
   
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
      By uploading your account statement through the RCFG platform, you are authorizing RCFG, LLC to access, and if needed, transmit your account information to one of our funding partners.
      </p>
    </div>
    
      {/* <InputError error={error} message={errorMessage} /> */}
    </div>
  );
};

export default DocumentCheckboxInput;
