import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import styles from "./DateOfBirthInput.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import {
  generateDays,
  generateMonths,
  generateMonthsMobile,
  generateYears,
} from "@/utils/dateUtils";
import useIsWideScreen from "@/hooks/useIsWideScreen";
import InputError from "./InputError";

const DateOfBirthInput = ({ selectedAnswerIndexes ,isError,errorMessage}) => {
  const isWideScreen = useIsWideScreen();
  const [error, setError] = useState(isError);

  const [selectedDay, setSelectedDay] = useState(
    selectedAnswerIndexes[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(
    selectedAnswerIndexes[1]
  );
  const [selectedYear, setSelectedYear] = useState(
    selectedAnswerIndexes[2]
  );
  const [days, setDays] = useState(generateDays(1, 1920)); // Initialize with January and year 2006

  const { handleDateChange } = useQuestionnaire();
  const months = isWideScreen ? generateMonths() : generateMonthsMobile();
  const years = generateYears(1920, 2006);
  useEffect(() => {
    setError(isError);
  }, [isError]);
  // Update days when month or year changes
  useEffect(() => {
    
    const monthIndex =
      selectedMonth >=0
        ? months.indexOf(months[selectedMonth]) + 1
        : 1;
    const year =
      selectedYear >=0 ? parseInt(years[selectedYear], 10) : 2006;

        setDays(generateDays(monthIndex, year))
   
  }, [selectedMonth, selectedYear]);

  const handleDaySelect = (index) => {
    setSelectedDay(index);
  };

  const handleMonthSelect = (index) => {
    setSelectedMonth(index);
  };

  const handleYearSelect = (index) => {
    setSelectedYear(index);
  };

  return (
    <div className={styles.dateOfBirthContainer}>
    <div className={styles.dobList}>

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

          <InputError error={error} message={errorMessage} />

    </div>
  );
};

export default DateOfBirthInput;
