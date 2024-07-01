import React, { useState } from "react";
import Dropdown from "../Dropdown.jsx"
import styles from "./DateOfBirthInput.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
const generateDays = () => Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const generateMonths = () => Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const generateYears = (startYear, endYear) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return years;
};

const DateOfBirthInput = ({selectedAnswerIndexes}) => {
  const [selectedDay, setSelectedDay] = useState(selectedAnswerIndexes ? selectedAnswerIndexes[0] : undefined);
  const [selectedMonth, setSelectedMonth] = useState(selectedAnswerIndexes ? selectedAnswerIndexes[1] : undefined);
  const [selectedYear, setSelectedYear] = useState(selectedAnswerIndexes ? selectedAnswerIndexes[2] : undefined);

  const {handleDateChange}=useQuestionnaire();
  const days = generateDays();
  const months = generateMonths();
  const years = generateYears(1900, new Date().getFullYear());

  const handleDaySelect = (index) => {
    setSelectedDay(index);
    
    handleDateChange({
      day: days[index],
      month: selectedMonth !== undefined ? months[selectedMonth] : undefined,
      year: selectedYear !== undefined ? years[selectedYear] : undefined,
    });
  };

  const handleMonthSelect = (index) => {
    setSelectedMonth(index);
    handleDateChange({
      day: selectedDay !== undefined ? days[selectedDay] : undefined,
      month: months[index],
      year: selectedYear !== undefined ? years[selectedYear] : undefined,
    });
  };

  const handleYearSelect = (index) => {
    setSelectedYear(index);
    handleDateChange({
      day: selectedDay !== undefined ? days[selectedDay] : undefined,
      month: selectedMonth !== undefined ? months[selectedMonth] : undefined,
      year: years[index],
    });
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
      />
      <Dropdown
        subQuestion={{
          code: "birth_date",
          example: "Month",
          answers: months,
        }}
        type="month"
        selectedAnswerIndex={selectedMonth}
      />
      <Dropdown
        subQuestion={{
          code: "birth_date",
          example: "Year",
          answers: years,
        }}
        type="year"
        selectedAnswerIndex={selectedYear}
      />
    </div>
  );
};

export default DateOfBirthInput;
