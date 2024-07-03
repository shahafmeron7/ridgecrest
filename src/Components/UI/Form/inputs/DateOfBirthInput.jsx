import React, { useState,useEffect } from "react";
import Dropdown from "./Dropdown";
import styles from "./DateOfBirthInput.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import { generateDays,generateMonths,generateYears } from "@/utils/dateUtils";

const DateOfBirthInput = ({selectedAnswerIndexes}) => {
  const [selectedDay, setSelectedDay] = useState(selectedAnswerIndexes ? selectedAnswerIndexes[0] : undefined);
  const [selectedMonth, setSelectedMonth] = useState(selectedAnswerIndexes ? selectedAnswerIndexes[1] : undefined);
  const [selectedYear, setSelectedYear] = useState(selectedAnswerIndexes ? selectedAnswerIndexes[2] : undefined);

  const {handleDateChange}=useQuestionnaire();
  const [days, setDays] = useState(generateDays(1, 2006)); // Initialize with January and year 2006
  const months = generateMonths();
  const years = generateYears(2006, new Date().getFullYear());

   // Update days when month or year changes
   useEffect(() => {
    console.log("changing dates")
    const monthIndex = selectedMonth !== undefined ? months.indexOf(months[selectedMonth]) + 1 : 1;
    const year = selectedYear !== undefined ? parseInt(years[selectedYear], 10) : 2006;
    setDays(generateDays(monthIndex, year));
  }, [selectedMonth, selectedYear]);

  const handleDaySelect = (index) => {
    console.log('day');
    setSelectedDay(index);
    
  };

  const handleMonthSelect = (index) => {
    console.log('month');

    setSelectedMonth(index);
  
  };

  const handleYearSelect = (index) => {
    console.log('year');

    setSelectedYear(index);
   
  };

  return (
    <div className={styles.dateOfBirthContainer}>
      <Dropdown
        subQuestion={{
          code: "birth_date",
          example: "Day",
          answers: days,
        }}
        type="day"
        selectedAnswerIndex={selectedDay}
        dateHandler={handleDaySelect}
      />
      <Dropdown
        subQuestion={{
          code: "birth_date",
          example: "Month",
          answers: months,
        }}
        type="month"
        selectedAnswerIndex={selectedMonth}
        dateHandler={handleMonthSelect}

      />
      <Dropdown
        subQuestion={{
          code: "birth_date",
          example: "Year",
          answers: years,
        }}
        type="year"
        selectedAnswerIndex={selectedYear}
        dateHandler={handleYearSelect}

      />
    </div>
  );
};

export default DateOfBirthInput;
