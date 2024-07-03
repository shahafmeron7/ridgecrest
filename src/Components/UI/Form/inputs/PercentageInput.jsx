import React, { useState,useEffect } from 'react';
import styles from './InputWithValidation.module.css'
import {useQuestionnaire} from '@/context/QuestionnaireContext.jsx'
import InputError from './InputError';
const PercentageInput = ({subQuestion,isError}) => {
   const {handleInputChange} = useQuestionnaire()
   const [value, setValue] = useState('');
   const [error, setError] = useState(isError);
   useEffect(() => {
      setError(isError);
    }, [isError]);
  const handleChange = (e) => {
   const val = e.target.value;
   if (val === '' || (/^\d+$/.test(val) && val >= 0 && val <= 100)) {
     setValue(val);
     handleInputChange(subQuestion.code, val,false);
   }
 };

 const handleKeyDown = (e) => {
   if (e.key === 'ArrowUp') {
     setValue((prevValue) => {
       const newValue = prevValue === '' ? 1 : Math.min(100, Number(prevValue) + 1);
       handleInputChange(subQuestion.code, newValue.toString(),false);

       return newValue.toString();
     });
   } else if (e.key === 'ArrowDown') {
     setValue((prevValue) => {
       const newValue = prevValue === '' ? 0 : Math.max(0, Number(prevValue) - 1);
       handleInputChange(subQuestion.code, newValue.toString(),false);
       return newValue.toString();
     });
   }
 };

  const handleBlur = () => {
    if (value === '') {
      setValue('');
    }
  };

  return (
   

   <div
   className={styles.inputContainer}>
      <input
          className={`${styles.input} ${error ? `${styles.inputError}` : ""}`}
          type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={subQuestion.example}
      />
    <InputError error={error} message={subQuestion.error}/>
    </div>

   
  );
};

export default PercentageInput;
