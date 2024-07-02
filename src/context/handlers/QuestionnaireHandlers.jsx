// src/context/questionnaire/eventHandlers.js
import * as actionTypes from "./../../reducers/actionTypes.js";
import { useCallback } from "react";
import { validateField } from "@/utils/validationUtils";
import { gsap } from "gsap";
import questionnaireData from "@/utils/data/questionnaireData.js";
import {
  buildEventData,
  sendImpressions,
} from "@/utils/impression/impressionUtils";

import { chooseBrand } from "@/utils/scoring/newScoring.js";

import { updatePaycorResponseFormat } from "@/utils/helperFunctions";
import env from "@/utils/data/env";

const TIME_DELAY_NEXT_QUESTION = 0.2;

export const QuestionnaireHandlers = (state, dispatch) => {
  const findStepNumber = (questionCode) => {
    return questionnaireData.questions.find((q) => q.code === questionCode)
      .step;
  };
  const animateAndNavigate = (onComplete, nextProgressWidth, delay = 0) => {
    dispatch({ type: actionTypes.SET_IS_ANIMATING_OUT, payload: true });
    const tl = gsap.timeline({
      onComplete: () => {
        dispatch({ type: actionTypes.SET_IS_ANIMATING_OUT, payload: false });
        onComplete();
      },
    });

    tl.to(".progressLine", {
      width: `${nextProgressWidth}%`,
      duration: 0.3,
      ease: "none",
    });

    tl.to(
      ".animateFadeOut",
      {
        opacity: 0,
        delay: delay,
        duration: 0.1,
      },
      `+=0.1`
    );
  };
  const moveToPrevQuestion = () => {
    const { questionHistory } = state;
    if (questionHistory.length > 1) {
      const newHistory = questionHistory.slice(0, -1);
      const prevQuestionCode = newHistory[newHistory.length - 1];
      const prevStep = findStepNumber(prevQuestionCode);
      const newProgressBarWidth = Math.min(
        100,
        Math.round(((prevStep - 1) / (4 - 1)) * 100)
      );

      dispatch({
        type: actionTypes.SET_PROGRESS_BAR_WIDTH,
        payload: newProgressBarWidth,
      });
      animateAndNavigate(() => {
        dispatch({
          type: actionTypes.SET_CURRENT_QUESTION_CODE,
          payload: prevQuestionCode,
        });
        // goToPrevious(prevQuestionCode,newHistory);  // Now purely handles the state and history update
      }, newProgressBarWidth);

      dispatch({ type: actionTypes.SET_QUESTION_HISTORY, payload: newHistory });
    }
  };

  const moveToNextQuestion = () => {
    let proceedToNext = true;
    let nextQuestionCode;

    const {
      currentQuestion,
      currentQuestionCode,
      responses,
      flowID,
      flowName,
    } = state;
    const newErrResponses = {};
    if (
      currentQuestion.type === "details-question" ||
      currentQuestion.type === "form-type"
    ) {
      currentQuestion.subquestions.forEach((sub) => {
        const response = responses[sub.code]?.answer;

        if (sub.element === "input" || sub.element==="free_text") {
          console.log('validation input code',sub.validationCode)
          if (!validateField(sub.validationCode, response)) {
            proceedToNext = false;
            newErrResponses[sub.code] = true; // Set error for this sub-question
          }
        } else if (sub.element === "dropdown" || sub.element === "selection") {
          if (
            response === null ||
            response === undefined ||
            response.trim() === ""
          ) {
            proceedToNext = false;
            // newErrResponses[sub.code] = true; // Set error for this sub-question
          }
          console.log("dropdown/selection proceedToNext", proceedToNext);
        }
      });
      nextQuestionCode = currentQuestion.answers[0]?.next_question_code;
      console.log("movetonextquestion", proceedToNext);
    } else if (currentQuestion.type === "one-selection") {
      const response = responses[currentQuestion.code];
      if (response && response.answerIndexes) {
        const selectedIndex = response.answerIndexes[0];

        nextQuestionCode =
          currentQuestion.answers[selectedIndex]?.next_question_code;
      } else {
        proceedToNext = false;
      }
    } else if (currentQuestion.type === "multi-selection") {
      const response = responses[currentQuestion.code];
      if (
        response &&
        response.answerIndexes &&
        response.answerIndexes.length > 0
      ) {
        nextQuestionCode =
          currentQuestion.answers[response.answerIndexes[0]]
            ?.next_question_code;
      } else {
        proceedToNext = false;
      }
    }

    if (proceedToNext && nextQuestionCode) {
      const eventData = buildEventData(
        currentQuestion,
        flowID,
        flowName,
        env.USER_ACTION_CLICK_NEXT
      );
      sendImpressions(eventData, env.USER_EVENT_NAME, env.STREAM_STEP_NAME);
      dispatch({ type: actionTypes.CHANGE_NEXT_BTN_STATE, isEnabled: true });

      const nextStep = findStepNumber(nextQuestionCode);
      const newProgressBarWidth = Math.min(
        100,
        Math.round(((nextStep - 1) / (4 - 1)) * 100)
      );
      dispatch({
        type: actionTypes.SET_PROGRESS_BAR_WIDTH,
        payload: newProgressBarWidth,
      });

      animateAndNavigate(
        () => {
          // goToNext(nextQuestionCode)
          handleNavigateNextQuestion(nextQuestionCode);
        },
        newProgressBarWidth,
        TIME_DELAY_NEXT_QUESTION
      );
    } else {
      // dispatch({ type: actionTypes.CHANGE_NEXT_BTN_STATE, isEnabled: false });
      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  };

  const handleNavigateNextQuestion = (nextQuestionCode) => {
    if (nextQuestionCode !== "loader") {
      dispatch({
        type: actionTypes.APPEND_TO_QUESTION_HISTORY,
        payload: nextQuestionCode,
      });
    }
    dispatch({
      type: actionTypes.SET_CURRENT_QUESTION_CODE,
      payload: nextQuestionCode,
    });
    window.history.pushState({}, null, " ");
  };

  const handleMultipleAnswerSelection = (questionCode, selectedIndexes) => {
    const { currentQuestion } = state;
    const answersData = selectedIndexes.map((index) => {
      return {
        text: currentQuestion.answers[index].text,
        index: index,
      };
    });

    const response = {
      answer: answersData.map((answer) => answer.text).join(", "),
      answerIndexes: selectedIndexes,
      step: currentQuestion.step,
      question: currentQuestion.text,
    };

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: response,
    });
  };
  const checkAndEnableNextButton = useCallback(() => {
    const { currentQuestion, responses } = state;
    if (
      currentQuestion.type === "details-question" ||
      currentQuestion.type === "form-type"
    ) {
      // Check if all subquestions have been answered
      const allSubquestionsAnswered = currentQuestion.subquestions.every(
        (sub) => {
          const response = responses[sub.code];

          // Check for different input types
          if (sub.element === "input" || sub.element==="free_text") {
            console.log("input/freetext");

            return response && response.answer && response.answer.trim() !== "";
          } else if (
            sub.element === "dropdown" ||
            sub.element === "selection"
          ) {
           
            console.log("dropdown/selection");
            return (
              response && response.answer !== null && response.answer !== ""
            );
          }
          else if (sub.element === "birthdate") {
            console.log("birth_date");
            return response &&
                   response.answer &&
                   response.answer.day !== "" &&
                   response.answer.month !== "" &&
                   response.answer.year !== "";
          }

          // Fallback to default check for other types
          return response && response.answer && response.answer.trim() !== "";
        }
      );
      dispatch({
        type: actionTypes.CHANGE_NEXT_BTN_STATE,
        isEnabled: allSubquestionsAnswered,
      });
    } else {
      const response = responses[currentQuestion.code];
      let isAnswered = false;

      if (response) {
        // Separate logic for one-selection, which may include an 'other' text input
        if (currentQuestion.type === "one-selection") {
          if (response.answerIndexes.length > 0) {
            const answerIndex = response.answerIndexes[0]; // Since one-selection should have only one index
            if (currentQuestion.answers[answerIndex].isOther) {
              // Check if other text is not empty when 'Other' option is selected
              isAnswered =
                response.other_text !== undefined &&
                response.other_text !== null &&
                response.other_text.trim() !== "";
            } else {
              // Regular answer is selected

              isAnswered = true;
            }
          }
        } else if (currentQuestion.type === "multi-selection") {
          isAnswered = response.answerIndexes.length > 0;
        }
      }
      dispatch({
        type: actionTypes.CHANGE_NEXT_BTN_STATE,
        isEnabled: isAnswered,
      });
    }
  }, [state.currentQuestion, state.responses, dispatch]);

  const handleAnswerSelection = (questionCode, answerIndex) => {
    const { currentQuestion, responses } = state;
    const answer = currentQuestion.answers[answerIndex];
    const answerText = answer?.text;
    const existingResponse = responses[questionCode] || {};
    // checkAndUpdateFormID(questionCode, answerIndex);

    const newResponse = {
      ...existingResponse,
      answer: answerText,
      answerIndexes: [answerIndex],
      step: currentQuestion.step,
      question: currentQuestion.text,
    };

    if (answer?.isOther) {
      newResponse.other_text = existingResponse.other_text || "";
    } else {
      if (newResponse.other_text) {
        delete newResponse.other_text;
      }
    }

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: newResponse,
    });
    const nextQuestionCode = answer?.next_question_code;
    if (nextQuestionCode) {
      const nextStep = findStepNumber(nextQuestionCode);
      const newProgressBarWidth = Math.min(
        100,
        Math.round(((nextStep - 1) / (4 - 1)) * 100)
      );
      dispatch({
        type: actionTypes.SET_PROGRESS_BAR_WIDTH,
        payload: newProgressBarWidth,
      });

      animateAndNavigate(
        () => {
          //goToNext(nextQuestionCode)
          handleNavigateNextQuestion(nextQuestionCode);
        },
        newProgressBarWidth,
        TIME_DELAY_NEXT_QUESTION
      );
    }
  };
  const handleDateChange = (questionCode, type, inputValue,inputIndex) => {
    const { currentQuestion, responses } = state;
    const currentResponse = responses[questionCode] || {
      step: currentQuestion.step,
      question:
        currentQuestion.type === "details-question" ||
        currentQuestion.type === "form-type"
          ? currentQuestion.subquestions.find(
              (sub) => sub.code === questionCode
            ).text
          : currentQuestion.text,
          answerIndexes: [-1, -1, -1], // Initial indexes for day, month, year

      answer: {
        day: "",
        month: "",
        year: "",
      },
    };
     // Update the specific type (day, month, or year) in the answer
  const updatedAnswer = {
    ...currentResponse.answer,
    [type]: inputValue
  };
  // Update the answerIndexes based on the type
  const updatedAnswerIndexes = [...currentResponse.answerIndexes];
  if (type === "day") {
    updatedAnswerIndexes[0] = inputIndex;
  } else if (type === "month") {
    updatedAnswerIndexes[1] = inputIndex;
  } else if (type === "year") {
    updatedAnswerIndexes[2] = inputIndex;
  }
  // Update the response with the new answer
  const updatedResponse = {
    ...currentResponse,
    answer: updatedAnswer,
    answerIndexes: updatedAnswerIndexes,
  };
    console.log(updatedResponse);

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: updatedResponse,
    });
  };

  const handleSelectionInputChange = (questionCode, answerIndex, type) => {
    const { currentQuestion, responses } = state;
    const selectedAnswer = currentQuestion.subquestions.find(
      (sub) => sub.code === questionCode
    ).answers[answerIndex];

    const currentResponse = responses[questionCode] || {
      step: currentQuestion.step,
      question:
        currentQuestion.type === "details-question" ||
        currentQuestion.type === "form-type"
          ? currentQuestion.subquestions.find(
              (sub) => sub.code === questionCode
            ).text
          : currentQuestion.text,
      answerIndexes: [],
    };

    const updatedResponse = {
      ...currentResponse,
      answerIndexes: [answerIndex],
      answer: selectedAnswer,
    };

    console.log(updatedResponse);

    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: updatedResponse,
    });
  };

  const handleInputChange = (questionCode, inputValue, isOther = false) => {
    const { currentQuestion, responses, errResponses } = state;
    const currentResponse = responses[questionCode] || {
      step: currentQuestion.step,
      question:
        currentQuestion.type === "details-question" ||
        currentQuestion.type === "form-type"
          ? currentQuestion.subquestions.find(
              (sub) => sub.code === questionCode
            ).text
          : currentQuestion.text,
      answerIndexes: [],
    };

    let updatedResponse;

    if (!isOther) {
      updatedResponse = {
        ...currentResponse,
        answer: inputValue,
      };
    } else {
      const otherIndex = currentQuestion.answers.findIndex(
        (answer) => answer.isOther
      );
      const otherAnswerText = currentQuestion.answers[otherIndex].text;
      updatedResponse = {
        ...currentResponse,
        answer: otherAnswerText,
        other_text: inputValue,
        answerIndexes: [otherIndex],
      };
    }
    dispatch({
      type: actionTypes.UPDATE_RESPONSES,
      questionCode: questionCode,
      response: updatedResponse,
    });
    console.log("isEnabled", inputValue.trim().length > 0);
    // dispatch({
    //   type: actionTypes.CHANGE_NEXT_BTN_STATE,
    //   isEnabled: inputValue.trim().length > 0,
    // });
    // Check if there's an existing error and clear it
    if (errResponses[questionCode]) {
      const newErrResponses = { ...errResponses };

      delete newErrResponses[questionCode]; // Remove the error entry for this question

      dispatch({
        type: actionTypes.SET_ERR_RESPONSES,
        payload: newErrResponses,
      });
    }
  };

  const completeQuestionnaire = useCallback(() => {
    const { responses } = state;
    let finalResponses = {};
    Object.entries(responses).forEach(([key, value]) => {
      value.users_answer = value.answer;
      //  For 'num_employees', convert the range to a single number (e.g., '2-9' becomes '2')
      if (key === "num_employees") {
        let answerIndex = value.answerIndexes[0];
        value.answer = answerIndex !== 0 ? value.answer.split(/[-+]/)[0] : "1";
      }
      // if(key==="birth_date"){
      //   const formattedAnswer = `${currentResponse.answer.day || ""}/${
      //     currentResponse.answer.month || ""
      //   }/${currentResponse.answer.year || ""}`;
      // }
    });
    const selectedBrand = chooseBrand(responses);
    // console.log("selectedBrand",selectedBrand)
    finalResponses = Object.keys(responses).reduce((acc, key) => {
      const { answerIndexes, ...responseWithoutIndexes } = responses[key];
      acc[key] = responseWithoutIndexes;
      return acc;
    }, {});
    // const testEmail = {
    //   "7": "test@adptest.com",
    //   "9": "RyzeFinalTest@paychextest.com",
    //   "10": "test@paycortest.com"
    // }
    // const { selectedBrand, allScores } = calculateScores(finalResponses);
    // console.log(selectedBrand);
    // const selectedBrand ="9";
    //  console.log("Selected Brand:", selectedBrand);
    //  console.log("allScores",allScores);
    //  console.log("Scores:", allScores);
    // let testID='9';
    if (selectedBrand === env.PAYCOR_FORM_ID) {
      //  console.log("change paycor")
      updatePaycorResponseFormat(finalResponses);
    }
    //  finalResponses["email"]["answer"] = testEmail[selectedBrand];
    // finalResponses["email"]["answer"] = "sonary3@adptest.com";

    // console.log(finalResponses);

    sendImpressions(
      finalResponses,
      env.FINAL_SUBMIT_EVENT_NAME,
      env.STREAM_FINAL_NAME,
      selectedBrand
    );
    dispatch({
      type: actionTypes.TOGGLE_QUESTIONNAIRE_COMPLETED,
      payload: true,
    });
  }, [state.targetFormID, state.responses]);

  const changeNextBtnState = (isEnabled) => {
    dispatch({ type: actionTypes.CHANGE_NEXT_BTN_STATE, isEnabled: isEnabled });
  };

  return {
    animateAndNavigate,
    moveToPrevQuestion,
    checkAndEnableNextButton,
    moveToNextQuestion,
    handleNavigateNextQuestion,
    handleMultipleAnswerSelection,
    handleAnswerSelection,
    handleInputChange,
    handleDateChange,
    handleSelectionInputChange,
    completeQuestionnaire,
    changeNextBtnState,
  };
};
