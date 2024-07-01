import React, { useState, useRef, useEffect } from "react";
import styles from "./InputWithValidation.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import gsap from "gsap";

const InputWithValidation = React.forwardRef(
  (
    {
      type,
      inputType,
      name,
      value,
      placeholder,
      maxLength = null,
      isOther = false,
      errorMessage,
      isError,
    },
    ref
  ) => {
    gsap.config({
      nullTargetWarn: false,
    });

    const inputRef = useRef(null);

    const { handleInputChange } = useQuestionnaire();
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState(isError);
    useEffect(() => {
      setError(isError);
    }, [isError]);

    useEffect(() => {
      if (isOther) {
        gsap.fromTo(
          ".animateOtherInput",
          { y: -136, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            delay: 0.8,
            duration: 0.5,
            ease: "none",
            onComplete: () => {
              const element = ref.current;
              if (element) {
                setTimeout(() => {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                  });
                }, 500);
                element.focus();
              }
            }
          }
        );
      }
    }, [isOther]);

    const formatPhoneNumber = (value) => {
      const phoneNumber = value.replace(/[^\d]/g, "");
      const phoneNumberLength = phoneNumber.length;

      if (phoneNumberLength < 4) return phoneNumber;
      if (phoneNumberLength < 7) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      console.log(name)
      const formattedValue = name === "phone" ? formatPhoneNumber(newValue) : newValue;

      setInputValue(formattedValue);
      handleInputChange(name, formattedValue, isOther);
    };

    return (
      <div
        className={`${styles.inputContainer} ${
          isOther ? `animateOtherInput ${styles.otherInput}` : ""
        }`}
        style={name === "company_name" ? { width: "100%" } : {}}
      >
      {inputType==='input' ? (
        <input
          data-lpignore="true"
          ref={ref}
          type={type}
          name={name}
          maxLength={maxLength}
          value={inputValue}
          inputMode={name === "phone" ? "numeric" : type}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${styles.input} ${error ? `${styles.inputError}` : ""}`}
        />

      ):
      (
        <textarea
          className={`${styles.textarea} ${error ? `${styles.inputError}` : ""}`}
          value={inputValue}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      )
      }
                {/* <label className={styles.inputLabel}>{placeholder}</label> */}


        <div
          className={`${styles.errContainer} ${
            error ? `${styles.visible}` : `${styles.notVisible}`
          }`}
        >
          <img
            src="https://assets.sonary.com/wp-content/uploads/2024/01/24143354/Icon-Name-2.svg"
            alt="error icon"
          />
          <span className={styles.errText}>{errorMessage}</span>
        </div>
      </div>
    );
  }
);

export default InputWithValidation;
