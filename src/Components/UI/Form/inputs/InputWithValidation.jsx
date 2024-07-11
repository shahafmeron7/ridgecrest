import React, { useState, useEffect } from "react";
import styles from "./InputWithValidation.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import gsap from "gsap";
import InputError from "./InputError";
import formatInputValue  from "@/utils/formatUtils";

const InputWithValidation = React.forwardRef(
  (
    {
      type,
      inputType,
      name,
      value,
      validationCode,
      placeholder,
      minLength = null,
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

    const { handleInputChange } = useQuestionnaire();
    const [inputValue, setInputValue] = useState(value);

    const [error, setError] = useState(isError);
    useEffect(() => {
      // console.log('iserror inputvalidation')
      setError(isError);
    }, [isError]);

    useEffect(() => {
      if (isOther) {
        animateOtherInput(ref);
      }
    }, [isOther, ref]);

    const animateOtherInput = (ref) => {
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
                  block: "center",
                });
              }, 500);
              element.focus();
            }
          },
        }
      );
    };

    

    const handleChange = (e) => {
      const newValue = e.target.value;
      const formattedValue = formatInputValue(newValue, validationCode);

      if (formattedValue !== inputValue) {
        setInputValue(formattedValue);
        handleInputChange(name, formattedValue, isOther);
      }
    };
    const inputMode = ["phone", "zip", "id", "ssn", "tax_id"].includes(
      validationCode
    )
      ? "numeric"
      : "text";
    return (
      <div className={styles.inputContainer}>
        {inputType === "input" ? (
          <input
            data-lpignore="true"
            ref={ref}
            type={type}
            name={name}
            minLength={minLength}
            maxLength={maxLength}
            value={inputValue}
            inputMode={inputMode}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${styles.input} ${error ? `${styles.inputError}` : ""}`}
          />
        ) : (
          <textarea
            className={`${styles.textarea} ${
              error ? `${styles.inputError}` : ""
            }`}
            value={inputValue}
            onChange={handleChange}
            maxLength={maxLength}
            placeholder={placeholder}
          />
        )}
        <InputError error={error} message={errorMessage} />
      </div>
    );
  }
);

export default InputWithValidation;
