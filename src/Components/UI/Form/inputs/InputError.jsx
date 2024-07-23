import React, { useEffect, useRef } from "react";
import styles from "./InputWithValidation.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
const InputError = ({ error, message, marginTop }) => {
  const imgStyle = marginTop ? { marginTop: `${marginTop}px` } : {};
  const errorRef = useRef(null);
  const { errResponses } = useQuestionnaire();
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error, errResponses]);
  return (
    <div
      ref={errorRef}
      className={`${styles.errContainer} ${
        error ? `${styles.visible}` : `${styles.notVisible}`
      }`}
    >
      <img
        src="https://assets.sonary.com/wp-content/uploads/2024/01/24143354/Icon-Name-2.svg"
        alt="error icon"
        style={imgStyle}
      />
      <span className={styles.errText}>{message}</span>
    </div>
  );
};

export default InputError;
