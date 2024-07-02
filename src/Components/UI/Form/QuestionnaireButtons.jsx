import React, { useEffect,useCallback,useContext } from "react";
import styles from "../../Questionnaire/Questionnaire.module.css";
import { useQuestionnaire } from "@/context/QuestionnaireContext.jsx";
import useIsWideScreen from "@/hooks/useIsWideScreen";
import arrowTop from '@/images/chevronTop.svg?url'

import { buildEventData,sendImpressions } from "@/utils/impression/impressionUtils";
import env from '@/utils/data/env';

import OsanoVisibilityContext from "@/context/OsanoVisibilityContext";


const USER_ACTION_CLICK_PREV = env.USER_ACTION_CLICK_PREV;
const STREAM_STEP_NAME = env.STREAM_STEP_NAME;
const USER_EVENT_NAME = env.USER_EVENT_NAME;

const QuestionnaireButtons = () => {
  const isWideScreen = useIsWideScreen();
  const { osanoShown } = useContext(OsanoVisibilityContext);

  const {
    questionHistory,
    questionnaireStarted,
    currentQuestionCode,
    checkAndEnableNextButton,
    moveToNextQuestion,
    inputModified,
    nextBtnEnabled,
    moveToPrevQuestion,
    responses,
    isAnimatingOut,
    currentQuestion,
    flowID,
    flowName,
  } = useQuestionnaire();
  const isFinalStep = currentQuestionCode === "personal_information";

  const handleNextButtonClick = useCallback(() => {
    if (!isAnimatingOut) {
      moveToNextQuestion();
    }
  }, [isAnimatingOut, moveToNextQuestion]);

    useEffect(() => {
      checkAndEnableNextButton();
    }, [checkAndEnableNextButton,currentQuestion, responses]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
               (inputModified || nextBtnEnabled)
      ) {
        handleNextButtonClick();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleNextButtonClick,
    inputModified,
    nextBtnEnabled,
  ]);
  const handlePrevClick =()=>{
    sendImpressions(buildEventData(currentQuestion,flowID,flowName,USER_ACTION_CLICK_PREV), USER_EVENT_NAME, STREAM_STEP_NAME);
    moveToPrevQuestion();
  }

  const mobileButtonsStyle = {
    position: "fixed",
    bottom: (osanoShown && questionnaireStarted && !isWideScreen) ? '88px' : '0px',
    width: "100%",
    backgroundColor: "#fff",
    padding: "16px",
  };
  return (
    <div
      key={currentQuestionCode}
      className={`animateStaggerItem animateFadeOut ${styles.buttonsWrapper}`}
      style={questionnaireStarted && !isWideScreen ? mobileButtonsStyle : {}}
    >
      {questionHistory.length > 1 && (
        <button className={styles.prevBtn} onClick={handlePrevClick} disabled={isAnimatingOut}>
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
  <path fillRule="evenodd" clipRule="evenodd" d="M14.0669 3.30806C14.311 3.55214 14.311 3.94786 14.0669 4.19194L8.25888 10L14.0669 15.8081C14.311 16.0521 14.311 16.4479 14.0669 16.6919C13.8229 16.936 13.4271 16.936 13.1831 16.6919L6.93306 10.4419C6.81585 10.3247 6.75 10.1658 6.75 10C6.75 9.83424 6.81585 9.67527 6.93306 9.55806L13.1831 3.30806C13.4271 3.06398 13.8229 3.06398 14.0669 3.30806Z" fill="#323738"/>
</svg>
        </button>
      )}
      <button
        className={`${styles.nextBtn} ${
          inputModified || nextBtnEnabled ? styles.enabled : ""
        }`}
        onClick={() =>
           handleNextButtonClick()
        }
        disabled={
          isAnimatingOut || !nextBtnEnabled
        }
      >
        {!questionnaireStarted ? "Let's start" : isFinalStep ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuestionnaireButtons;
