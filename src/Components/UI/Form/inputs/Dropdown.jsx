import React, { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
import InputError from "./InputError";

const Dropdown = ({
  subQuestion,
  type = null,
  selectedAnswerIndex = -1,
  dateHandler = null,
  isError,
  errorMessage,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(selectedAnswerIndex);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrollable, setIsScrollable] = useState(
    subQuestion.answers.length >= 4
  );
  const [error, setError] = useState(isError);

  const {
    handleSelectionInputChange,
    handleDateChange,
    toggleDropdownPadding,
  } = useQuestionnaire();
  const dropdownContainerRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const dropdownContentWrapperRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [typedLetters, setTypedLetters] = useState("");
  const [typedIndex, setTypedIndex] = useState(-1);

  useEffect(() => {
    setError(isError);
  }, [isError]);
  useEffect(() => {
    setSelectedIndex(selectedAnswerIndex);
  }, [selectedAnswerIndex]);

  useEffect(() => {
    if (selectedIndex !== -1 && dropdownOpen) {
      handleSelect(subQuestion.code, selectedIndex, false);
      scrollToItem(selectedIndex);
    }
  }, [selectedIndex, dropdownOpen]);
  const handleSelect = (questionCode, index, closeDropdown = true) => {
    setSelectedIndex(index);


    if (closeDropdown) {
      setDropdownOpen(false);
    }
    if (type) {
      dateHandler(index);
      handleDateChange(questionCode, type, subQuestion.answers[index], index);
    } else {
      handleSelectionInputChange(questionCode, index, type);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleClickOutside = (event) => {
    if (
      dropdownContainerRef.current &&
      !dropdownContainerRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  const handlePositionCheck = (event) => {
    if (dropdownContainerRef.current && dropdownContentRef.current) {
      let yDropdownContentPosition =
        window.scrollY +
        dropdownContentRef.current.getBoundingClientRect().top +
        dropdownContentRef.current.getBoundingClientRect().height;
      let bottom = document.documentElement.getBoundingClientRect().height;

      let diff = yDropdownContentPosition - bottom;
      if (diff >= 0) {
        toggleDropdownPadding(
          true,
          dropdownContentRef.current.getBoundingClientRect().height
        );
      }
      setTimeout(() => {
        dropdownContentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 0);
    }
  };
  const handleKeyDown = (e) => {
    if (dropdownOpen) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(
            (prevIndex) => (prevIndex + 1) % subQuestion.answers.length
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prevIndex) =>
              (prevIndex - 1 + subQuestion.answers.length) %
              subQuestion.answers.length
          );
          break;
        case "Enter":
          // console.log("enter");
          e.preventDefault();
          setDropdownOpen(false);
          break;
        default:
          handleCharacterNavigation(e.key);
          break;
      }
    }
  };
  const handleCharacterNavigation = (char) => {
    const typedLetter = char.toLowerCase();

    setTypedLetters((prevTypedLetters) => {
      const updatedTypedLetters = prevTypedLetters + typedLetter;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setTypedLetters("");
      }, 500);

      const filteredIndexes = subQuestion.answers
        .map((answer, index) => ({ answer, index }))
        .filter((item) =>
          item.answer.toLowerCase().startsWith(updatedTypedLetters)
        )
        .map((item) => item.index);

      if (filteredIndexes.length > 0) {
        const nextIndexItem = filteredIndexes[0]; // Take the first match
        setTypedIndex(nextIndexItem);
        scrollToItem(nextIndexItem);
        handleSelect(subQuestion.code, nextIndexItem, false);
      } else {
        setTypedIndex(-1);
      }

      return updatedTypedLetters;
    });
  };
  // const handleArrowDown = () => {
  //   setSelectedIndex((prevIndex) => {
  //     const newIndex = (prevIndex + 1) % subQuestion.answers.length;
  //     // handleSelect(subQuestion.code, newIndex, false);

  //     scrollToItem(newIndex);

  //     return newIndex;
  //   });
  // };

  // const handleArrowUp = () => {
  //   setSelectedIndex((prevIndex) => {
  //     const newIndex =
  //       (prevIndex - 1 + subQuestion.answers.length) %
  //       subQuestion.answers.length;
  //     handleSelect(subQuestion.code, newIndex, false);

  //     scrollToItem(newIndex);

  //     return newIndex;
  //   });
  // };
  const scrollToItem = (index) => {
    if (dropdownContentWrapperRef.current) {
      const itemElement = dropdownContentWrapperRef.current.children[index];
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };
  useEffect(() => {
    if (dropdownOpen) {
      handlePositionCheck();
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      toggleDropdownPadding(false);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      setTypedLetters("");
      setTypedIndex(-1);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const dropdownButtonClass =
    type === "day"
      ? styles.dropdownButtonDay
      : type === "month"
      ? styles.dropdownButtonMonth
      : type === "year"
      ? styles.dropdownButtonYear
      : "";
  const combinedClassNames = `${dropdownButtonClass} ${styles.dropdownButton} ${
    dropdownOpen ? `${styles.rotated} ${styles.open}` : ""
  } ${
    selectedIndex === undefined || selectedIndex < 0 ? styles.placeholder : ""
  }`;

  return (
    <div className={styles.dropdownContainer} ref={dropdownContainerRef}>
      <button className={`${combinedClassNames}`} onClick={toggleDropdown}>
        {selectedIndex === undefined || selectedIndex < 0
          ? subQuestion.example
          : subQuestion.answers[selectedIndex]}
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
      <div
        ref={dropdownContentRef}
        className={`${styles.dropdownContent} ${
          dropdownOpen ? styles.show : ""
        } `}
      >
        <div
          ref={dropdownContentWrapperRef}
          className={`${styles.dropdownContentWrapper} ${
            isScrollable ? styles.scrollable : ""
          }`}
        >
          {subQuestion.answers.map((answer, index) => (
            <div
              key={index}
              className={`${styles.dropdownItem} ${
                selectedIndex === index ? styles.selected : ""
              }`}
              onClick={() => handleSelect(subQuestion.code, index)}
            >
              {answer}
            </div>
          ))}
        </div>
      </div>
      <InputError error={error} message={errorMessage} />
    </div>
  );
};

export default Dropdown;

// const checkDropdownPosition = () => {
//   if (dropdownContainerRef.current && dropdownContentRef.current) {
//     // console.log('checking dropdown position')
//     const dropdownRect = dropdownContainerRef.current.getBoundingClientRect();
//     const dropdownContentRect =
//       dropdownContentRef.current.getBoundingClientRect();
//     const spaceBelow = window.innerHeight - dropdownRect.bottom;
//     const spaceAbove = dropdownRect.top;
//     setDropdownContentHeight(dropdownContentRect.height);

//     if (
//       spaceBelow < dropdownContentRect.height &&
//       spaceAbove > dropdownContentRect.height
//     ) {
//       // console.log('checking dropdown position, true')

//       setDropdownAbove(true);
//     } else {
//       // console.log('checking dropdown position, false')

//       setDropdownAbove(false);
//     }
//   }
// };

// if (!isWideScreen) {
//   checkDropdownPosition();
// }else{
//   //
// }

// const handleKeyDown = (event) => {
//   if (!dropdownOpen) return;

//   clearTimeout(keyTypedTimeout.current);
//   keyTypedTimeout.current = setTimeout(() => {
//     keyTyped.current = "";
//     lastChar.current = "";
//     lastIndices.current = [];
//     currentCharIndex.current = 0;
//   }, 500);

//   if (event.key.length === 1) {
//     // Handle letter keys
//     keyTyped.current += event.key.toLowerCase();

//     const currentChar = keyTyped.current[0];
//     if (!currentChar) return;

//     if (currentChar !== lastChar.current) {
//       lastChar.current = currentChar;
//       lastIndices.current = subQuestion.answers.reduce(
//         (acc, answer, index) => {
//           if (answer.toLowerCase().startsWith(currentChar)) {
//             acc.push(index);
//           }
//           return acc;
//         },
//         []
//       );
//       currentCharIndex.current = 0;
//     } else {
//       currentCharIndex.current =
//         (currentCharIndex.current + 1) % lastIndices.current.length;
//     }

//     const nextIndex = lastIndices.current[currentCharIndex.current];
//     if (nextIndex !== undefined) {
//       handleSelect(subQuestion.code, nextIndex, false);
//       dropdownContentWrapperRef.current.scrollTop =
//         dropdownContentWrapperRef.current.children[nextIndex].offsetTop;
//     }
//   } else if (event.key === "ArrowDown") {
//     // Handle Arrow Down key
//     const nextIndex = (selectedIndex + 1) % subQuestion.answers.length;
//     handleSelect(subQuestion.code, nextIndex, false);
//     dropdownContentWrapperRef.current.scrollTop =
//       dropdownContentWrapperRef.current.children[nextIndex].offsetTop;
//   } else if (event.key === "ArrowUp") {
//     // Handle Arrow Up key
//     const nextIndex =
//       (selectedIndex - 1 + subQuestion.answers.length) %
//       subQuestion.answers.length;
//     handleSelect(subQuestion.code, nextIndex, false);
//     dropdownContentWrapperRef.current.scrollTop =
//       dropdownContentWrapperRef.current.children[nextIndex].offsetTop;
//   }
// };
