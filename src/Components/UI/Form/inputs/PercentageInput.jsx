import React, { useState,useEffect } from 'react';
import styles from './InputWithValidation.module.css'
import {useQuestionnaire} from '@/context/QuestionnaireContext.jsx'
import InputError from './InputError';
const PercentageInput = ({subQuestion,value,isError,errorMessage}) => {
   const {handleInputChange} = useQuestionnaire()
   const [inputValue, setInputValue] = useState(value);
   const [error, setError] = useState(isError);
   useEffect(() => {
      setError(isError);
    }, [isError]);
  const handleChange = (e) => {
    const val = e.target.value.replace('%', '');

  //  const val = e.target.value;
   if (val === '' || (/^\d+$/.test(val) && val >= 0 && val <= 100)) {
     setInputValue(val);

     handleInputChange(subQuestion.code, val,false);
   }
 };

 const handleKeyDown = (e) => {
  let numericValue = value.replace('%', '');
  numericValue = numericValue === '' ? 0 : Number(numericValue);

  if (e.key === 'ArrowUp') {
    numericValue = Math.min(100, numericValue + 1);
  } else if (e.key === 'ArrowDown') {
    numericValue = Math.max(0, numericValue - 1);
  } else {
    return;
  }

  const newValueWithPercentage = `${numericValue}%`;
  setInputValue(newValueWithPercentage);
  handleInputChange(subQuestion.code, newValueWithPercentage, false);
  e.preventDefault(); // Prevent the default behavior of arrow keys
};

  
 const handleBlur = () => {
  if (value !== '' && !value.includes('%')) {
    const newValue = `${value}%`;
    setInputValue(newValue);
    // console.log("handleBlur",newValue)
    handleInputChange(subQuestion.code, newValue, false);
  }
};

  return (
   

   <div
   className={styles.inputContainer}>
      <input
          className={`${styles.input} ${error ? `${styles.inputError}` : ""}`}
          type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={subQuestion.example}
      />
    <InputError error={error} message={errorMessage}/>
    </div>

   
  );
};

export default PercentageInput;
