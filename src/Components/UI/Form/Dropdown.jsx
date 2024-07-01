import React, { useState, useEffect, useRef } from "react";
import styles from './Dropdown.module.css'
import { useQuestionnaire } from '@/context/QuestionnaireContext';
const Dropdown = ({ subQuestion,type=null,selectedAnswerIndex }) => {
  
  const [selectedIndex, setSelectedIndex] = useState(selectedAnswerIndex);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleSelectionInputChange,handleDateChange } = useQuestionnaire();
  const dropdownRef = useRef(null);

  const handleSelect = (questionCode,index) => {
    setSelectedIndex(index);
    setDropdownOpen(false);
    //if its birthdate input, sending the type and the selection. e.g 'day' and '12'
    if(type){
      handleDateChange(questionCode,type,subQuestion.answers[index],index)
    }else{
      //regular dropdown 
      handleSelectionInputChange(questionCode,index,type)

    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const isScrollable = subQuestion.answers.length >= 7;
  const dropdownButtonClass = type === "day"
    ? styles.dropdownButtonDay
    : type === "month"
    ? styles.dropdownButtonMonth
    : type === "year"
    ? styles.dropdownButtonYear : ""
    const combinedClassNames = `${dropdownButtonClass} ${styles.dropdownButton} ${dropdownOpen ? `${styles.rotated} ${styles.open}` : ''} ${selectedIndex === undefined ? styles.placeholder : ''}`;

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={combinedClassNames}
        onClick={toggleDropdown}
      >
        {selectedIndex === undefined ? subQuestion.example : subQuestion.answers[selectedIndex]}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M14 12L9 7L4 12"
            stroke="#313131"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </button>
      <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.show : ''}`}>
      <div className={`${styles.dropdownContentWrapper} ${isScrollable ? styles.scrollable : ''}`}>

        {subQuestion.answers.map((answer, index) => (
          <div
            key={index}
            className={`${styles.dropdownItem} ${selectedIndex === index ? styles.selected : ''}`}
            onClick={() => handleSelect(subQuestion.code,index)}
          >
            {answer}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Dropdown;
